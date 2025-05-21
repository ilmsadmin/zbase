import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { PermissionsService } from './permissions.service';
import { Controller } from '@nestjs/common/interfaces';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

/**
 * Chức năng tự động quét controllers để tạo permissions đã bị vô hiệu hóa theo yêu cầu.
 * Tham khảo file setup-roles-permissions.ts để biết cách thiết lập permissions thủ công.
 */
@Injectable()
export class ActionsDiscoveryService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}
  /**
   * Phương thức này đã bị vô hiệu hóa theo yêu cầu.
   * Trả về mảng rỗng thay vì quét các controllers để tạo permissions tự động.
   * Permissions giờ đây được quản lý thủ công thông qua script setup-roles-permissions.ts
   * 
   * @returns Mảng rỗng
   */
  async discoverActions() {
    console.log('Chức năng tự động quét controllers để tạo permissions đã bị vô hiệu hóa.');
    console.log('Tham khảo file setup-roles-permissions.ts để biết cách thiết lập permissions thủ công.');
    return [];
  }

  /**
   * @deprecated Phương thức này không còn được sử dụng do đã vô hiệu hóa chức năng
   * tự động quét controllers để tạo permissions
   */
  private buildActionName(method: string, path: string): string {
    // Phương thức này chỉ giữ lại để đảm bảo tính tương thích ngược
    // Permissions giờ đây được thiết lập thủ công
    return `deprecated:method`;
  }
}
