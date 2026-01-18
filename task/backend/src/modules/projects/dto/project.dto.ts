import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum ProjectStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold'
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @ApiProperty({ 
    required: false,
    enum: ProjectStatusEnum,
    default: ProjectStatusEnum.ACTIVE
  })
  @IsEnum(ProjectStatusEnum)
  @IsOptional()
  status?: ProjectStatusEnum;
}

export class UpdateProjectDto extends CreateProjectDto {}