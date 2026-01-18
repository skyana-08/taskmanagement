import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, IsInt, Min, Max } from 'class-validator';

export enum TaskStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    required: false,
    enum: TaskStatusEnum,
    default: TaskStatusEnum.PENDING
  })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @ApiProperty({ required: false, minimum: 1, maximum: 5, default: 1 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;

  @ApiProperty()
  @IsDateString()
  deadline: Date;

  @ApiProperty()
  @IsInt()
  projectId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  assignedUserId?: number;
}

export class UpdateTaskDto extends CreateTaskDto {}