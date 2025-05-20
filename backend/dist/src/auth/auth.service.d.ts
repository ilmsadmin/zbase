import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { PosCacheService } from '../redis/pos-cache.service';
import { PermissionsService } from '../permissions/permissions.service';
import { LogsService } from '../mongo/logs.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private redisService;
    private posCacheService;
    private permissionsService;
    private logsService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, redisService: RedisService, posCacheService: PosCacheService, permissionsService: PermissionsService, logsService: LogsService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            roles: string[];
            permissions: string[];
        };
    }>;
    logout(userId: number): Promise<{
        success: boolean;
    }>;
    getProfile(userId: number): Promise<any>;
    refreshToken(userId: number): Promise<{
        access_token: string;
    }>;
    decodeToken(token: string): any;
}
