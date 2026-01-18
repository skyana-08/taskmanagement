import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

export type ProjectStatus = 'active' | 'completed' | 'on-hold';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['active', 'completed', 'on-hold'],
    default: 'active'
  })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @ManyToOne(() => User, user => user.projects)
  createdBy: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}