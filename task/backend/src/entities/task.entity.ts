import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'in-progress', 'completed', 'blocked'],
    default: 'pending'
  })
  status: TaskStatus;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'date' })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.tasks, { nullable: true })
  assignedUser: User | null;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project;
}