import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PermissionsService } from '../../permissions/permissions.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    private redis;
    private permissions;
    constructor(configService: ConfigService, prisma: PrismaService, redis: RedisService, permissions: PermissionsService);
    validate(payload: any): Promise<{
        roles: string[];
        permissions: string[];
        id: number;
        name: string;
        createdAt: Date;
        email: string;
        updatedAt: Date;
    }>;
}
export {};
