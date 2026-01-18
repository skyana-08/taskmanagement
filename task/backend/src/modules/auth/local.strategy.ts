import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(`[LocalStrategy] Validating: ${email}`);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log(`[LocalStrategy] Validation failed for: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(`[LocalStrategy] Validation successful for: ${email}`);
    return user;
  }
}