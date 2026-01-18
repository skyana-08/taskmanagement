import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BeforeInsert } from 'typeorm';
import { Task } from './task.entity';
import { Project } from './project.entity';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 255 }) // Increased length for hashed password
  password: string;

  @Column({ default: false, name: 'is_admin' })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Task, task => task.assignedUser)
  tasks: Task[];

  @OneToMany(() => Project, project => project.createdBy)
  projects: Project[];

  // Optional: Add password hashing before insert
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}