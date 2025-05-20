import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    getRoleUsers(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
    }[]>;
    getRolePermissions(id: string): Promise<{
        id: number;
        createdAt: Date;
        description: string | null;
        action: string;
    }[]>;
}
