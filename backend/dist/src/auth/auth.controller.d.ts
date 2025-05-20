import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, ip: string, userAgent: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            roles: string[];
            permissions: string[];
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<any>;
    getProfile(req: Request): Promise<any>;
    logout(req: Request): Promise<{
        success: boolean;
    }>;
    refreshToken(req: Request): Promise<{
        access_token: string;
    }>;
}
