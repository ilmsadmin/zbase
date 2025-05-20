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
exports.LogSchema = exports.Log = exports.LogResourceType = exports.LogActionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var LogActionType;
(function (LogActionType) {
    LogActionType["LOGIN"] = "login";
    LogActionType["LOGOUT"] = "logout";
    LogActionType["CREATE_USER"] = "create_user";
    LogActionType["UPDATE_USER"] = "update_user";
    LogActionType["DELETE_USER"] = "delete_user";
    LogActionType["CREATE_WAREHOUSE"] = "create_warehouse";
    LogActionType["UPDATE_WAREHOUSE"] = "update_warehouse";
    LogActionType["DELETE_WAREHOUSE"] = "delete_warehouse";
    LogActionType["CREATE_PRODUCT"] = "create_product";
    LogActionType["UPDATE_PRODUCT"] = "update_product";
    LogActionType["DELETE_PRODUCT"] = "delete_product";
    LogActionType["IMPORT_INVENTORY"] = "import_inventory";
    LogActionType["EXPORT_INVENTORY"] = "export_inventory";
    LogActionType["CREATE_CUSTOMER"] = "create_customer";
    LogActionType["UPDATE_CUSTOMER"] = "update_customer";
    LogActionType["DELETE_CUSTOMER"] = "delete_customer";
    LogActionType["CREATE_PARTNER"] = "create_partner";
    LogActionType["UPDATE_PARTNER"] = "update_partner";
    LogActionType["DELETE_PARTNER"] = "delete_partner";
    LogActionType["CREATE_INVOICE"] = "create_invoice";
    LogActionType["UPDATE_INVOICE"] = "update_invoice";
    LogActionType["DELETE_INVOICE"] = "delete_invoice";
    LogActionType["CHANGE_INVOICE_STATUS"] = "change_invoice_status";
    LogActionType["CREATE_TRANSACTION"] = "create_transaction";
    LogActionType["UPDATE_TRANSACTION"] = "update_transaction";
    LogActionType["DELETE_TRANSACTION"] = "delete_transaction";
    LogActionType["CREATE_WARRANTY"] = "create_warranty";
    LogActionType["UPDATE_WARRANTY"] = "update_warranty";
    LogActionType["CHANGE_WARRANTY_STATUS"] = "change_warranty_status";
    LogActionType["OPEN_SHIFT"] = "open_shift";
    LogActionType["CLOSE_SHIFT"] = "close_shift";
    LogActionType["CREATE_SALE"] = "create_sale";
})(LogActionType || (exports.LogActionType = LogActionType = {}));
var LogResourceType;
(function (LogResourceType) {
    LogResourceType["USER"] = "user";
    LogResourceType["WAREHOUSE"] = "warehouse";
    LogResourceType["PRODUCT"] = "product";
    LogResourceType["CATEGORY"] = "category";
    LogResourceType["INVENTORY"] = "inventory";
    LogResourceType["CUSTOMER"] = "customer";
    LogResourceType["PARTNER"] = "partner";
    LogResourceType["INVOICE"] = "invoice";
    LogResourceType["TRANSACTION"] = "transaction";
    LogResourceType["WARRANTY"] = "warranty";
    LogResourceType["SHIFT"] = "shift";
})(LogResourceType || (exports.LogResourceType = LogResourceType = {}));
let Log = class Log extends mongoose_2.Document {
    userId;
    action;
    resourceType;
    resourceId;
    details;
    createdAt;
    ipAddress;
    userMetadata;
};
exports.Log = Log;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Log.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true, enum: Object.values(LogActionType) }),
    __metadata("design:type", String)
], Log.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, enum: Object.values(LogResourceType) }),
    __metadata("design:type", String)
], Log.prototype, "resourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], Log.prototype, "resourceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Log.prototype, "details", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, index: true }),
    __metadata("design:type", Date)
], Log.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], Log.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Log.prototype, "userMetadata", void 0);
exports.Log = Log = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'logs'
    })
], Log);
exports.LogSchema = mongoose_1.SchemaFactory.createForClass(Log);
exports.LogSchema.index({ userId: 1, action: 1 });
exports.LogSchema.index({ action: 1, resourceType: 1 });
exports.LogSchema.index({ resourceType: 1, resourceId: 1 });
exports.LogSchema.index({ createdAt: -1 });
exports.LogSchema.index({ action: 1, createdAt: -1 });
//# sourceMappingURL=log.schema.js.map