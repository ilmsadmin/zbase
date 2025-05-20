import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findLogs(userId?: string, action?: string | string[], resourceType?: string | string[], resourceId?: string, startDate?: string, endDate?: string, limit?: string, skip?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}> & import("./schemas/log.schema").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findInventoryLogs(warehouseId?: string, productId?: string, startDate?: string, endDate?: string, limit?: string, skip?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}> & import("./schemas/log.schema").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findSalesLogs(startDate?: string, endDate?: string, userId?: string, limit?: string, skip?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}> & import("./schemas/log.schema").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findWarrantyLogs(startDate?: string, endDate?: string, userId?: string, limit?: string, skip?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}> & import("./schemas/log.schema").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findUserActivity(userId: number, startDate?: string, endDate?: string, limit?: string, skip?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log.schema").Log, {}> & import("./schemas/log.schema").Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
