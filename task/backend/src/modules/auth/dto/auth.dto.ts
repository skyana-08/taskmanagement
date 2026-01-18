import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(3)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'testuser' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(3)
  password: string;
}