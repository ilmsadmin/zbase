import { Document } from 'mongoose';
export declare enum LogActionType {
    LOGIN = "login",
    LOGOUT = "logout",
    CREATE_USER = "create_user",
    UPDATE_USER = "update_user",
    DELETE_USER = "delete_user",
    CREATE_WAREHOUSE = "create_warehouse",
    UPDATE_WAREHOUSE = "update_warehouse",
    DELETE_WAREHOUSE = "delete_warehouse",
    CREATE_PRODUCT = "create_product",
    UPDATE_PRODUCT = "update_product",
    DELETE_PRODUCT = "delete_product",
    IMPORT_INVENTORY = "import_inventory",
    EXPORT_INVENTORY = "export_inventory",
    CREATE_CUSTOMER = "create_customer",
    UPDATE_CUSTOMER = "update_customer",
    DELETE_CUSTOMER = "delete_customer",
    CREATE_PARTNER = "create_partner",
    UPDATE_PARTNER = "update_partner",
    DELETE_PARTNER = "delete_partner",
    CREATE_INVOICE = "create_invoice",
    UPDATE_INVOICE = "update_invoice",
    DELETE_INVOICE = "delete_invoice",
    CHANGE_INVOICE_STATUS = "change_invoice_status",
    CREATE_TRANSACTION = "create_transaction",
    UPDATE_TRANSACTION = "update_transaction",
    DELETE_TRANSACTION = "delete_transaction",
    CREATE_WARRANTY = "create_warranty",
    UPDATE_WARRANTY = "update_warranty",
    CHANGE_WARRANTY_STATUS = "change_warranty_status",
    OPEN_SHIFT = "open_shift",
    CLOSE_SHIFT = "close_shift",
    CREATE_SALE = "create_sale"
}
export declare enum LogResourceType {
    USER = "user",
    WAREHOUSE = "warehouse",
    PRODUCT = "product",
    CATEGORY = "category",
    INVENTORY = "inventory",
    CUSTOMER = "customer",
    PARTNER = "partner",
    INVOICE = "invoice",
    TRANSACTION = "transaction",
    WARRANTY = "warranty",
    SHIFT = "shift"
}
export declare class Log extends Document {
    userId: number;
    action: string;
    resourceType?: string;
    resourceId?: string;
    details: Record<string, any>;
    createdAt: Date;
    ipAddress?: string;
    userMetadata?: {
        name?: string;
        email?: string;
        roles?: string[];
    };
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, Document<unknown, any, Log, any> & Log & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, Document<unknown, {}, import("mongoose").FlatRecord<Log>, {}> & import("mongoose").FlatRecord<Log> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
