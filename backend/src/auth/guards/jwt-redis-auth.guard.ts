import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRedisAuthGuard extends AuthGuard('jwt-redis') {}
