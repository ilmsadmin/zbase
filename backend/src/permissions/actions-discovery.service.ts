import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { PermissionsService } from './permissions.service';
import { Controller } from '@nestjs/common/interfaces';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

@Injectable()
export class ActionsDiscoveryService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async onModuleInit() {
    await this.discoverActions();
  }

  async discoverActions() {
    const controllers = this.discoveryService.getControllers();
    const actionSet = new Set<string>();

    controllers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance || !wrapper.metatype) return;

      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = this.reflector.get(PATH_METADATA, wrapper.metatype) || '';

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,        (methodName: string) => {
          const path = this.reflector.get(PATH_METADATA, instance[methodName]);
          const method = this.reflector.get(METHOD_METADATA, instance[methodName]);
            if (path && method) {
            const normalizedPath = Array.isArray(path) ? path[0] : path;
            const normalizedMethod = Array.isArray(method) ? method[0] : method;
            
            const fullPath = `${controllerPath}/${normalizedPath}`.replace(/\/+/g, '/');
            const action = this.buildActionName(normalizedMethod, fullPath);
            actionSet.add(action);
          }
        },
      );
    });

    // Register discovered actions as permissions
    for (const action of actionSet) {
      await this.permissionsService.createPermission(action);
    }

    return Array.from(actionSet);
  }  private buildActionName(method: string, path: string): string {
    // Remove path parameters like :id
    const cleanPath = path.replace(/\/:[^/]+/g, '');
    // Create permission name like "action:resource" (e.g., "list:users")
    const parts = cleanPath.split('/').filter(Boolean);
    let resource = parts[parts.length - 1];
    
    // Standardize method name
    let action = typeof method === 'string' ? method.toLowerCase() : String(method).toLowerCase();
    
    // Map HTTP methods to CRUD-like actions
    switch (action) {
      case 'get':
        action = parts.length > 1 && parts[parts.length - 1] !== parts[parts.length - 2] 
          ? 'view' : 'list';
        break;
      case 'post':
        action = 'create';
        break;
      case 'put':
      case 'patch':
        action = 'update';
        break;
      case 'delete':
        action = 'delete';
        break;
    }

    // Handle plural/singular resource names and standardize them
    if (resource.endsWith('s')) {
      resource = resource.toLowerCase();
    } else {
      resource = `${resource.toLowerCase()}s`;
    }

    // Return in format "action:resource" - follows standard pattern for permissions
    return `${action}:${resource}`;
  }
}
