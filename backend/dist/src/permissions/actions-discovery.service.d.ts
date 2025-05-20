import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
export declare class ActionsDiscoveryService implements OnModuleInit {
    private readonly discoveryService;
    private readonly metadataScanner;
    private readonly reflector;
    private readonly permissionsService;
    constructor(discoveryService: DiscoveryService, metadataScanner: MetadataScanner, reflector: Reflector, permissionsService: PermissionsService);
    onModuleInit(): Promise<void>;
    discoverActions(): Promise<string[]>;
    private buildActionName;
}
