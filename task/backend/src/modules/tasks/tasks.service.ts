import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { CreateTaskDto, TaskStatusEnum } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Find the project
    const project = await this.projectRepository.findOne({
      where: { id: createTaskDto.projectId, createdBy: { id: userId } },
    });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Find assigned user if provided
    let assignedUser: User | null = null;
    if (createTaskDto.assignedUserId) {
      assignedUser = await this.userRepository.findOne({
        where: { id: createTaskDto.assignedUserId }
      });
    }

    // Map TaskStatusEnum to TaskStatus
    const statusMap = {
      [TaskStatusEnum.PENDING]: 'pending' as TaskStatus,
      [TaskStatusEnum.IN_PROGRESS]: 'in-progress' as TaskStatus,
      [TaskStatusEnum.COMPLETED]: 'completed' as TaskStatus,
      [TaskStatusEnum.BLOCKED]: 'blocked' as TaskStatus,
    };

    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status ? statusMap[createTaskDto.status] : 'pending',
      priority: createTaskDto.priority || 1,
      deadline: new Date(createTaskDto.deadline),
      project: project,
      assignedUser: assignedUser,
    });
    
    const savedTask = await this.taskRepository.save(task);
    return savedTask;
  }

  async findAll(userId: number, filters?: any): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignedUser', 'assignedUser')
      .where('project.createdBy = :userId', { userId });

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters?.deadlineFrom && filters?.deadlineTo) {
      query.andWhere('task.deadline BETWEEN :from AND :to', {
        from: filters.deadlineFrom,
        to: filters.deadlineTo,
      });
    }

    return await query.getMany();
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'project.createdBy', 'assignedUser'],
    });

    if (!task || task.project.createdBy.id !== userId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, updateTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    // If assigned user is being updated
    if (updateTaskDto.assignedUserId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: updateTaskDto.assignedUserId }
      });
      task.assignedUser = assignedUser;
    }
    
    // Update other fields
    if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) task.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined) {
      const statusMap = {
        [TaskStatusEnum.PENDING]: 'pending' as TaskStatus,
        [TaskStatusEnum.IN_PROGRESS]: 'in-progress' as TaskStatus,
        [TaskStatusEnum.COMPLETED]: 'completed' as TaskStatus,
        [TaskStatusEnum.BLOCKED]: 'blocked' as TaskStatus,
      };
      task.status = statusMap[updateTaskDto.status as TaskStatusEnum];
    }
    if (updateTaskDto.priority !== undefined) task.priority = updateTaskDto.priority;
    if (updateTaskDto.deadline !== undefined) task.deadline = new Date(updateTaskDto.deadline);
    
    return await this.taskRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }
}