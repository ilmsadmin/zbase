import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';
export interface CreateLogDto {
    userId: number;
    action: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userMetadata?: {
        name?: string;
        email?: string;
        roles?: string[];
    };
}
export interface LogQueryOptions {
    userId?: number;
    action?: string | string[];
    resourceType?: string | string[];
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
    details?: Record<string, any>;
}
export declare class LogsService {
    private readonly logModel?;
    private readonly isMongoEnabled;
    constructor(logModel?: Model<Log> | undefined);
    createLog(logData: CreateLogDto): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    findLogs(options?: LogQueryOptions): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findLogsByUserId(userId: number, options?: Omit<LogQueryOptions, 'userId'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findLogsByAction(action: string, options?: Omit<LogQueryOptions, 'action'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findLogsByResource(resourceType: string, resourceId: string, options?: Omit<LogQueryOptions, 'resourceType' | 'resourceId'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findLogsByDateRange(startDate: Date, endDate: Date, options?: Omit<LogQueryOptions, 'startDate' | 'endDate'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findInventoryLogs(warehouseId?: string, productId?: string, options?: Omit<LogQueryOptions, 'resourceType' | 'action'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findSalesLogs(options?: Omit<LogQueryOptions, 'action'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findWarrantyLogs(options?: Omit<LogQueryOptions, 'resourceType'>): Promise<(import("mongoose").Document<unknown, {}, Log, {}> & Log & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
