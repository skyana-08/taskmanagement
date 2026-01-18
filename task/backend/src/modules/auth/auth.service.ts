import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(`[Auth] Validating user: ${email}`);
    
    try {
      // Find user without selecting password first
      const user = await this.userRepository.findOne({ 
        where: { email }
      });
      
      console.log(`[Auth] User found: ${user ? 'Yes' : 'No'}`);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      console.log(`[Auth] Comparing password...`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[Auth] Password valid: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      
      // Remove password from user object
      const { password: _, ...result } = user;
      console.log(`[Auth] User validated successfully: ${result.email}`);
      return result;
      
    } catch (error) {
      console.error('[Auth] Validate user error:', error.message);
      throw error;
    }
  }

  async login(user: any) {
    try {
      console.log(`[Auth] Logging in user: ${user.email}`);
      
      const payload = { 
        email: user.email, 
        sub: user.id, 
        username: user.username,
        isAdmin: user.isAdmin || false 
      };
      
      const token = this.jwtService.sign(payload);
      
      console.log(`[Auth] Login successful for: ${user.email}`);
      
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin || false,
        },
      };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  async register(userData: { email: string; username: string; password: string }): Promise<any> {
    try {
      console.log(`[Auth] Registering user: ${userData.email}`);
      
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ 
        where: { email: userData.email } 
      });
      
      if (existingUser) {
        console.log(`[Auth] Email already exists: ${userData.email}`);
        throw new BadRequestException('Email already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      console.log(`[Auth] Password hashed`);
      
      // Create user
      const user = this.userRepository.create({
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        isAdmin: false,
      });
      
      const savedUser = await this.userRepository.save(user);
      console.log(`[Auth] User saved to database: ${savedUser.id}`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = savedUser;
      
      // Automatically login after registration
      return this.login(userWithoutPassword);
      
    } catch (error) {
      console.error('[Auth] Register error:', error);
      throw error;
    }
  }
}