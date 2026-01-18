import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    console.log('[AuthController] Login request for:', loginDto.email);
    try {
      // Validate user credentials
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      
      // Generate token
      const result = await this.authService.login(user);
      console.log('[AuthController] Login successful');
      return result;
    } catch (error) {
      console.error('[AuthController] Login error:', error.message);
      throw error;
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    console.log('[AuthController] Register request for:', registerDto.email);
    try {
      const result = await this.authService.register(registerDto);
      console.log('[AuthController] Registration successful');
      return result;
    } catch (error) {
      console.error('[AuthController] Registration error:', error.message);
      throw error;
    }
  }

  @Post('test')
  @ApiOperation({ summary: 'Test endpoint' })
  test() {
    console.log('[AuthController] Test endpoint called');
    return { 
      message: 'Auth endpoint is working',
      timestamp: new Date().toISOString()
    };
  }
}