import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PosCacheService } from '../../redis/pos-cache.service';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
declare const JwtRedisStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRedisStrategy extends JwtRedisStrategy_base {
    private readonly configService;
    private readonly posCacheService;
    private readonly usersService;
    constructor(configService: ConfigService, posCacheService: PosCacheService, usersService: UsersService);
    validate(request: Request, payload: any): Promise<{
        id: any;
        username: any;
        email: any;
        roles: any;
        permissions: any;
    }>;
}
export {};
