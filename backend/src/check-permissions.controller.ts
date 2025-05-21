import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

/**
 * This is a temporary controller for checking the permissions and roles
 * Will be removed after verification
 */
@Controller('check-permissions')
export class CheckPermissionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async checkPermissions() {
    const roles = await this.prisma.role.findMany();
    
    const result = {
      roles: roles,
      rolePermissions: {}
    };
    
    for (const role of roles) {
      const permissions = await this.prisma.permission.findMany({
        where: {
          rolePermissions: {
            some: {
              roleId: role.id
            }
          }
        }
      });
      
      result.rolePermissions[role.name] = {
        count: permissions.length,
        permissions: permissions.map(p => p.action)
      };
    }
    
    return result;
  }
}
