"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_service_1 = require("./permissions.service");
const constants_1 = require("@nestjs/common/constants");
let ActionsDiscoveryService = class ActionsDiscoveryService {
    discoveryService;
    metadataScanner;
    reflector;
    permissionsService;
    constructor(discoveryService, metadataScanner, reflector, permissionsService) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.reflector = reflector;
        this.permissionsService = permissionsService;
    }
    async onModuleInit() {
        await this.discoverActions();
    }
    async discoverActions() {
        const controllers = this.discoveryService.getControllers();
        const actionSet = new Set();
        controllers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance || !wrapper.metatype)
                return;
            const prototype = Object.getPrototypeOf(instance);
            const controllerPath = this.reflector.get(constants_1.PATH_METADATA, wrapper.metatype) || '';
            this.metadataScanner.scanFromPrototype(instance, prototype, (methodName) => {
                const path = this.reflector.get(constants_1.PATH_METADATA, instance[methodName]);
                const method = this.reflector.get(constants_1.METHOD_METADATA, instance[methodName]);
                if (path && method) {
                    const normalizedPath = Array.isArray(path) ? path[0] : path;
                    const normalizedMethod = Array.isArray(method) ? method[0] : method;
                    const fullPath = `${controllerPath}/${normalizedPath}`.replace(/\/+/g, '/');
                    const action = this.buildActionName(normalizedMethod, fullPath);
                    actionSet.add(action);
                }
            });
        });
        for (const action of actionSet) {
            await this.permissionsService.createPermission(action);
        }
        return Array.from(actionSet);
    }
    buildActionName(method, path) {
        const cleanPath = path.replace(/\/:[^/]+/g, '');
        const parts = cleanPath.split('/').filter(Boolean);
        let resource = parts[parts.length - 1];
        let action = typeof method === 'string' ? method.toLowerCase() : String(method).toLowerCase();
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
        if (resource.endsWith('s')) {
            resource = resource.toLowerCase();
        }
        else {
            resource = `${resource.toLowerCase()}s`;
        }
        return `${action}:${resource}`;
    }
};
exports.ActionsDiscoveryService = ActionsDiscoveryService;
exports.ActionsDiscoveryService = ActionsDiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector,
        permissions_service_1.PermissionsService])
], ActionsDiscoveryService);
//# sourceMappingURL=actions-discovery.service.js.map