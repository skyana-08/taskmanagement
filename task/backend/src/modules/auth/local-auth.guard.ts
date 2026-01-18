import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('[LocalAuthGuard] Checking authentication...');
    try {
      const result = await super.canActivate(context) as boolean;
      console.log('[LocalAuthGuard] Authentication result:', result);
      return result;
    } catch (error) {
      console.error('[LocalAuthGuard] Authentication error:', error.message);
      throw error;
    }
  }
}