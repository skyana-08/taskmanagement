import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { CreateProjectDto, ProjectStatusEnum } from './dto/project.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    // Map ProjectStatusEnum to ProjectStatus
    const statusMap = {
      [ProjectStatusEnum.ACTIVE]: 'active' as ProjectStatus,
      [ProjectStatusEnum.COMPLETED]: 'completed' as ProjectStatus,
      [ProjectStatusEnum.ON_HOLD]: 'on-hold' as ProjectStatus,
    };

    const project = this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      deadline: createProjectDto.deadline,
      status: createProjectDto.status ? statusMap[createProjectDto.status] : 'active',
      createdBy: { id: userId } as any,
    });
    
    const savedProject = await this.projectRepository.save(project);
    return savedProject;
  }

  async findAll(userId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['tasks', 'tasks.assignedUser'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['tasks', 'tasks.assignedUser'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: number, updateProjectDto: Partial<CreateProjectDto>, userId: number): Promise<Project> {
    const project = await this.findOne(id, userId);
    
    if (updateProjectDto.status) {
      const statusMap = {
        [ProjectStatusEnum.ACTIVE]: 'active' as ProjectStatus,
        [ProjectStatusEnum.COMPLETED]: 'completed' as ProjectStatus,
        [ProjectStatusEnum.ON_HOLD]: 'on-hold' as ProjectStatus,
      };
      project.status = statusMap[updateProjectDto.status as ProjectStatusEnum];
    }
    
    // Update other fields
    if (updateProjectDto.name !== undefined) project.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined) project.description = updateProjectDto.description;
    if (updateProjectDto.deadline !== undefined) project.deadline = updateProjectDto.deadline;
    
    return await this.projectRepository.save(project);
  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.remove(project);
  }
}