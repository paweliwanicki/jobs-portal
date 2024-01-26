import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../decorators/is-public.decorator';
import { AuthenticationService } from '../authentication.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtCookieExtractor } from '../extractors/jwt-token-cookie.extractor';
import type { Request, Response } from 'express';
import { setJwtTokensCookies } from '../utils/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtAuthGuard');
  constructor(
    private reflector: Reflector,
    private authService: AuthenticationService,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = ExtractJwt.fromExtractors([JwtCookieExtractor])(request);

    try {
      if (!token) throw new UnauthorizedException('Access token is not set');
      const isValidAccessToken = this.authService.validateToken(token);
      if (isValidAccessToken) return this.activate(context);
    } catch (err) {
      this.logger.error(err.message);
      if (err.message === 'jwt expired') {
        await this.handleRefreshToken(request, response);
        return this.activate(context);
      }
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  async handleRefreshToken(request: Request, response: Response) {
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is not set');
    const isValidRefreshToken = this.authService.validateToken(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    if (!isValidRefreshToken)
      throw new UnauthorizedException('Refresh token is not valid');
    const { newAccessToken, newRefreshToken } =
      await this.authService.refreshJwtToken(refreshToken);

    request.cookies['jwtToken'] = newAccessToken;
    request.cookies['refreshToken'] = newRefreshToken;
    setJwtTokensCookies(newAccessToken, newRefreshToken, response);

    return { newAccessToken, newRefreshToken };
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
