"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryMiddleware = void 0;
/**
 * Middleware Prisma để tự động cập nhật tồn kho khi tạo hoặc cập nhật hóa đơn
 * Middleware này sẽ được đăng ký trong Prisma Service
 */
var inventoryMiddleware = function (params, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, invoice, invoiceDetails, _i, _a, detail;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, next(params)];
            case 1:
                result = _b.sent();
                if (!(params.model === 'Invoice' && params.action === 'create')) return [3 /*break*/, 5];
                invoice = result;
                if (!params.args.data.invoiceDetails) return [3 /*break*/, 5];
                invoiceDetails = params.args.data.invoiceDetails.create || [];
                _i = 0, _a = Array.isArray(invoiceDetails) ? invoiceDetails : [invoiceDetails];
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                detail = _a[_i];
                // Thực hiện cập nhật tồn kho
                return [4 /*yield*/, updateInventory(params.args.data.warehouseId, detail.productId, detail.quantity, params.args.data.employeeId, params.prisma || params.client)];
            case 3:
                // Thực hiện cập nhật tồn kho
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, result];
        }
    });
}); };
exports.inventoryMiddleware = inventoryMiddleware;
/**
 * Hàm cập nhật tồn kho và tạo giao dịch kho
 */
function updateInventory(warehouseId, productId, quantity, employeeId, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var inventory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.inventory.findUnique({
                        where: {
                            productId_warehouseId: {
                                productId: productId,
                                warehouseId: warehouseId,
                            },
                        },
                    })];
                case 1:
                    inventory = _a.sent();
                    if (!inventory) {
                        throw new Error("S\u1EA3n ph\u1EA9m kh\u00F4ng t\u1ED3n t\u1EA1i trong kho n\u00E0y: Product ID ".concat(productId, ", Warehouse ID ").concat(warehouseId));
                    }
                    if (inventory.quantity < quantity) {
                        throw new Error("Kh\u00F4ng \u0111\u1EE7 t\u1ED3n kho: Hi\u1EC7n t\u1EA1i c\u00F3 ".concat(inventory.quantity, ", y\u00EAu c\u1EA7u ").concat(quantity));
                    }
                    // Cập nhật tồn kho
                    return [4 /*yield*/, prisma.inventory.update({
                            where: {
                                productId_warehouseId: {
                                    productId: productId,
                                    warehouseId: warehouseId,
                                },
                            },
                            data: {
                                quantity: {
                                    decrement: quantity,
                                },
                                lastUpdated: new Date(),
                            },
                        })];
                case 2:
                    // Cập nhật tồn kho
                    _a.sent();
                    // Tạo giao dịch kho
                    return [4 /*yield*/, prisma.inventoryTransaction.create({
                            data: {
                                type: 'EXPORT',
                                productId: productId,
                                warehouseId: warehouseId,
                                quantity: quantity,
                                employeeId: employeeId,
                            },
                        })];
                case 3:
                    // Tạo giao dịch kho
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
