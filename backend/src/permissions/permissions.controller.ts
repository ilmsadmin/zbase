import { Controller, Get, Post, Put, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { ActionsDiscoveryService } from './actions-discovery.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly actionsDiscoveryService: ActionsDiscoveryService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }
  /**
   * Endpoint này đã bị vô hiệu hóa theo yêu cầu.
   * Không còn hỗ trợ tự động khám phá permissions từ controllers.
   * Permissions giờ đây được quản lý thủ công thông qua script setup-roles-permissions.ts
   * 
   * @deprecated
   */
  @Get('discover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async discoverActions() {
    return {
      message: 'Chức năng tự động quét controllers để tạo permissions đã bị vô hiệu hóa.',
      note: 'Tham khảo file setup-roles-permissions.ts để biết cách thiết lập permissions thủ công.',
      actions: []
    };
  }

  @Post('role/:roleId/permission/:permissionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.permissionsService.assignPermissionToRole(
      parseInt(roleId, 10),
      parseInt(permissionId, 10),
    );
    
    return { success: true };
  }

  @Get('role/:roleId')
  @UseGuards(JwtAuthGuard)
  async getPermissionsByRole(@Param('roleId') roleId: string) {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: parseInt(roleId, 10) },
      include: { permission: true },
    });
    
    return rolePermissions.map(rp => rp.permission);
  }
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserPermissions(@Param('userId') userId: string) {
    return this.permissionsService.getUserPermissions(parseInt(userId, 10));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updatePermission(
    @Param('id') id: string,
    @Body() updateData: { action?: string; description?: string },
  ) {
    return this.permissionsService.updatePermission(
      parseInt(id, 10),
      updateData,
    );
  }

  @Post('normalize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async normalizePermissions() {
    return this.permissionsService.normalizePermissions();
  }

  @Delete('role/:roleId/permission/:permissionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.permissionsService.removePermissionFromRole(
      parseInt(roleId, 10),
      parseInt(permissionId, 10),
    );
    
    return { success: true };
  }
}
