"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosService = void 0;
// filepath: d:\www\zbase\backend\src\pos\pos.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var PosService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PosService = _classThis = /** @class */ (function () {
        function PosService_1(prisma, shiftsService) {
            this.prisma = prisma;
            this.shiftsService = shiftsService;
        }
        PosService_1.prototype.checkActiveShift = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var shift;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.shiftsService.findCurrentShift(userId)];
                        case 1:
                            shift = _a.sent();
                            if (!shift) {
                                return [2 /*return*/, {
                                        hasActiveShift: false,
                                        message: 'No active shift found for the user',
                                    }];
                            }
                            return [2 /*return*/, {
                                    hasActiveShift: true,
                                    shiftData: shift,
                                }];
                    }
                });
            });
        };
        PosService_1.prototype.createQuickSale = function (createQuickSaleDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var activeShift, warehouseId, customer, subtotal, taxAmount, processedItems, _i, _a, item, product, inventory, unitPrice, itemTaxAmount, itemSubtotal, itemTotal, totalAmount, invoiceCount, invoiceCode, invoice, _b, processedItems_1, item, transactionCount, transactionCode;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.shiftsService.findCurrentShift(userId)];
                        case 1:
                            activeShift = _f.sent();
                            if (!activeShift) {
                                throw new common_1.BadRequestException('User does not have an active shift');
                            }
                            warehouseId = activeShift.warehouseId;
                            if (!createQuickSaleDto.customerId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.customer.findUnique({
                                    where: { id: createQuickSaleDto.customerId },
                                })];
                        case 2:
                            customer = _f.sent();
                            if (!customer) {
                                throw new common_1.NotFoundException("Customer with ID ".concat(createQuickSaleDto.customerId, " not found"));
                            }
                            _f.label = 3;
                        case 3:
                            subtotal = 0;
                            taxAmount = 0;
                            processedItems = [];
                            _i = 0, _a = createQuickSaleDto.items;
                            _f.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 8];
                            item = _a[_i];
                            return [4 /*yield*/, this.prisma.product.findUnique({
                                    where: { id: item.productId },
                                })];
                        case 5:
                            product = _f.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("Product with ID ".concat(item.productId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.inventory.findFirst({
                                    where: {
                                        productId: item.productId,
                                        warehouseId: warehouseId,
                                        quantity: {
                                            gte: item.quantity,
                                        },
                                    },
                                })];
                        case 6:
                            inventory = _f.sent();
                            if (!inventory) {
                                throw new common_1.BadRequestException("Insufficient inventory for product ID ".concat(item.productId));
                            }
                            unitPrice = item.unitPrice || product.basePrice;
                            itemTaxAmount = Number(unitPrice) * Number(item.quantity) * (Number(product.taxRate) / 100);
                            itemSubtotal = Number(unitPrice) * Number(item.quantity);
                            itemTotal = itemSubtotal + itemTaxAmount;
                            subtotal += itemSubtotal;
                            taxAmount += itemTaxAmount;
                            processedItems.push({
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: unitPrice,
                                taxRate: product.taxRate,
                                taxAmount: itemTaxAmount,
                                discountRate: 0,
                                discountAmount: 0,
                                totalAmount: itemTotal,
                                locationId: inventory.locationId,
                            });
                            _f.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 4];
                        case 8:
                            totalAmount = subtotal + taxAmount - (createQuickSaleDto.discountAmount || 0);
                            return [4 /*yield*/, this.prisma.invoice.count()];
                        case 9:
                            invoiceCount = _f.sent();
                            invoiceCode = "INV-".concat(new Date().getFullYear()).concat((new Date().getMonth() + 1)
                                .toString()
                                .padStart(2, '0')).concat((invoiceCount + 1).toString().padStart(4, '0'));
                            return [4 /*yield*/, this.prisma.invoice.create({
                                    data: {
                                        code: invoiceCode,
                                        customerId: createQuickSaleDto.customerId,
                                        userId: userId,
                                        shiftId: activeShift.id,
                                        warehouseId: warehouseId,
                                        subtotal: subtotal,
                                        taxAmount: taxAmount,
                                        discountAmount: createQuickSaleDto.discountAmount || 0,
                                        totalAmount: totalAmount,
                                        paidAmount: createQuickSaleDto.paidAmount || 0,
                                        paymentMethod: createQuickSaleDto.paymentMethod || 'cash',
                                        status: ((_c = createQuickSaleDto.paidAmount) !== null && _c !== void 0 ? _c : 0) >= totalAmount ? 'paid' : 'pending',
                                        notes: createQuickSaleDto.notes,
                                        items: {
                                            create: processedItems,
                                        },
                                    },
                                    include: {
                                        items: true,
                                        customer: {
                                            select: {
                                                id: true,
                                                name: true,
                                                phone: true,
                                            },
                                        },
                                    },
                                })];
                        case 10:
                            invoice = _f.sent();
                            _b = 0, processedItems_1 = processedItems;
                            _f.label = 11;
                        case 11:
                            if (!(_b < processedItems_1.length)) return [3 /*break*/, 15];
                            item = processedItems_1[_b];
                            return [4 /*yield*/, this.prisma.inventory.updateMany({
                                    where: {
                                        productId: item.productId,
                                        warehouseId: warehouseId,
                                    },
                                    data: {
                                        quantity: {
                                            decrement: item.quantity,
                                        },
                                    },
                                })];
                        case 12:
                            _f.sent();
                            // Record the inventory transaction
                            return [4 /*yield*/, this.prisma.inventoryTransaction.create({
                                    data: {
                                        productId: item.productId,
                                        warehouseId: warehouseId,
                                        locationId: item.locationId,
                                        transactionType: 'out',
                                        quantity: item.quantity,
                                        referenceType: 'invoice',
                                        referenceId: invoice.id,
                                        userId: userId,
                                        notes: "POS quick sale for invoice ".concat(invoice.code),
                                    },
                                })];
                        case 13:
                            // Record the inventory transaction
                            _f.sent();
                            _f.label = 14;
                        case 14:
                            _b++;
                            return [3 /*break*/, 11];
                        case 15:
                            if (!(((_d = createQuickSaleDto.paidAmount) !== null && _d !== void 0 ? _d : 0) > 0)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.prisma.transaction.count()];
                        case 16:
                            transactionCount = _f.sent();
                            transactionCode = "TRX-".concat(new Date().getFullYear()).concat((new Date().getMonth() + 1)
                                .toString()
                                .padStart(2, '0')).concat((transactionCount + 1).toString().padStart(4, '0'));
                            return [4 /*yield*/, this.prisma.transaction.create({
                                    data: {
                                        code: transactionCode,
                                        transactionType: 'receipt',
                                        transactionMethod: createQuickSaleDto.paymentMethod || 'cash',
                                        amount: new client_1.Prisma.Decimal((_e = createQuickSaleDto.paidAmount) !== null && _e !== void 0 ? _e : 0),
                                        customerId: createQuickSaleDto.customerId,
                                        invoiceId: invoice.id,
                                        referenceType: 'invoice',
                                        referenceId: invoice.id,
                                        userId: userId,
                                        shiftId: activeShift.id,
                                        paymentMethod: createQuickSaleDto.paymentMethod || 'cash',
                                        notes: "Payment for invoice ".concat(invoice.code),
                                    },
                                })];
                        case 17:
                            _f.sent();
                            _f.label = 18;
                        case 18: return [2 /*return*/, invoice];
                    }
                });
            });
        };
        PosService_1.prototype.checkInventory = function (inventoryCheckDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var activeShift, warehouseId, warehouse, inventoryItems, allItemsAvailable, _i, _a, item, product, inventory, available, currentQty;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.shiftsService.findCurrentShift(userId)];
                        case 1:
                            activeShift = _b.sent();
                            if (!activeShift) {
                                throw new common_1.BadRequestException('User does not have an active shift');
                            }
                            warehouseId = activeShift.warehouseId;
                            return [4 /*yield*/, this.prisma.warehouse.findUnique({
                                    where: { id: warehouseId },
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                })];
                        case 2:
                            warehouse = _b.sent();
                            if (!warehouse) {
                                throw new common_1.NotFoundException("Warehouse with ID ".concat(warehouseId, " not found"));
                            }
                            inventoryItems = [];
                            allItemsAvailable = true;
                            _i = 0, _a = inventoryCheckDto.items;
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            item = _a[_i];
                            return [4 /*yield*/, this.prisma.product.findUnique({
                                    where: { id: item.productId },
                                    select: {
                                        id: true,
                                        name: true,
                                        code: true,
                                        basePrice: true,
                                        unit: true,
                                    },
                                })];
                        case 4:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("Product with ID ".concat(item.productId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.inventory.findFirst({
                                    where: {
                                        productId: item.productId,
                                        warehouseId: warehouseId,
                                    },
                                    include: {
                                        location: true,
                                    },
                                })];
                        case 5:
                            inventory = _b.sent();
                            available = inventory && inventory.quantity >= item.quantity;
                            currentQty = inventory ? inventory.quantity : 0;
                            if (!available) {
                                allItemsAvailable = false;
                            }
                            inventoryItems.push({
                                productId: item.productId,
                                product: product,
                                requestedQuantity: item.quantity,
                                availableQuantity: currentQty,
                                isAvailable: available,
                                location: (inventory === null || inventory === void 0 ? void 0 : inventory.location) || null,
                            });
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 3];
                        case 7: return [2 /*return*/, {
                                warehouseId: warehouse.id,
                                warehouseName: warehouse.name,
                                items: inventoryItems,
                                allItemsAvailable: allItemsAvailable,
                            }];
                    }
                });
            });
        };
        PosService_1.prototype.getDashboardData = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var activeShift, shiftId, warehouseId, salesStats, cashTransactions, cardTransactions, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.shiftsService.findCurrentShift(userId)];
                        case 1:
                            activeShift = _a.sent();
                            if (!activeShift) {
                                throw new common_1.BadRequestException('User does not have an active shift');
                            }
                            shiftId = activeShift.id;
                            warehouseId = activeShift.warehouseId;
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        COALESCE(SUM(\"totalAmount\"), 0) as \"totalSales\",\n        COUNT(*) as \"totalInvoices\",\n        SUM(CASE WHEN \"status\" = 'pending' THEN 1 ELSE 0 END) as \"pendingInvoices\"\n      FROM \"Invoice\"\n      WHERE \"shiftId\" = ", "\n    "], ["\n      SELECT \n        COALESCE(SUM(\"totalAmount\"), 0) as \"totalSales\",\n        COUNT(*) as \"totalInvoices\",\n        SUM(CASE WHEN \"status\" = 'pending' THEN 1 ELSE 0 END) as \"pendingInvoices\"\n      FROM \"Invoice\"\n      WHERE \"shiftId\" = ", "\n    "])), shiftId)];
                        case 2:
                            salesStats = _a.sent();
                            return [4 /*yield*/, this.prisma.transaction.aggregate({
                                    where: {
                                        shiftId: shiftId,
                                        transactionMethod: 'cash',
                                    },
                                    _sum: {
                                        amount: true,
                                    },
                                })];
                        case 3:
                            cashTransactions = _a.sent();
                            return [4 /*yield*/, this.prisma.transaction.aggregate({
                                    where: {
                                        shiftId: shiftId,
                                        transactionMethod: 'card',
                                    },
                                    _sum: {
                                        amount: true,
                                    },
                                })];
                        case 4:
                            cardTransactions = _a.sent();
                            stats = salesStats[0];
                            return [2 /*return*/, {
                                    shiftId: shiftId,
                                    warehouseId: warehouseId,
                                    userId: userId,
                                    totalSales: Number((stats === null || stats === void 0 ? void 0 : stats.totalSales) || 0),
                                    totalInvoices: Number((stats === null || stats === void 0 ? void 0 : stats.totalInvoices) || 0),
                                    pendingInvoices: Number((stats === null || stats === void 0 ? void 0 : stats.pendingInvoices) || 0),
                                    cashReceived: Number(cashTransactions._sum.amount || 0),
                                    cardReceived: Number(cardTransactions._sum.amount || 0),
                                }];
                    }
                });
            });
        };
        PosService_1.prototype.getRecentSales = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, limit) {
                var activeShift, shiftId, skip, _a, invoices, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.shiftsService.findCurrentShift(userId)];
                        case 1:
                            activeShift = _b.sent();
                            if (!activeShift) {
                                throw new common_1.BadRequestException('User does not have an active shift');
                            }
                            shiftId = activeShift.id;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.invoice.findMany({
                                        where: {
                                            shiftId: shiftId,
                                        },
                                        skip: skip,
                                        take: limit,
                                        orderBy: {
                                            createdAt: 'desc',
                                        },
                                        include: {
                                            customer: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    phone: true,
                                                },
                                            },
                                            items: {
                                                select: {
                                                    id: true,
                                                    productId: true,
                                                    quantity: true,
                                                    unitPrice: true,
                                                    totalAmount: true,
                                                    product: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            code: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.invoice.count({
                                        where: {
                                            shiftId: shiftId,
                                        },
                                    }),
                                ])];
                        case 2:
                            _a = _b.sent(), invoices = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: invoices,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        PosService_1.prototype.searchProducts = function (query_1, warehouseId_1) {
            return __awaiter(this, arguments, void 0, function (query, warehouseId, page, limit) {
                var skip, where, _a, products, total, transformedProducts;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            where = {};
                            if (query) {
                                where.OR = [
                                    { name: { contains: query, mode: 'insensitive' } },
                                    { code: { contains: query, mode: 'insensitive' } },
                                    { barcode: { contains: query, mode: 'insensitive' } },
                                ];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.product.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: {
                                            name: 'asc',
                                        },
                                        select: {
                                            id: true,
                                            code: true,
                                            name: true,
                                            description: true,
                                            barcode: true,
                                            basePrice: true,
                                            unit: true,
                                            taxRate: true,
                                            inventory: {
                                                where: {
                                                    warehouseId: warehouseId,
                                                },
                                                select: {
                                                    quantity: true,
                                                    location: {
                                                        select: {
                                                            id: true,
                                                            zone: true,
                                                            aisle: true,
                                                            rack: true,
                                                            shelf: true,
                                                            position: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.product.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), products = _a[0], total = _a[1];
                            transformedProducts = products.map(function (product) {
                                var inventoryItem = product.inventory[0];
                                return __assign(__assign({}, product), { availableQuantity: inventoryItem ? inventoryItem.quantity : 0, location: inventoryItem ? inventoryItem.location : null, inventory: undefined });
                            });
                            return [2 /*return*/, {
                                    items: transformedProducts,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        PosService_1.prototype.searchCustomers = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, page, limit) {
                var skip, where, _a, customers, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            where = {};
                            if (query) {
                                where.OR = [
                                    { name: { contains: query, mode: 'insensitive' } },
                                    { phone: { contains: query, mode: 'insensitive' } },
                                    { email: { contains: query, mode: 'insensitive' } },
                                    { code: { contains: query, mode: 'insensitive' } },
                                ];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.customer.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: {
                                            name: 'asc',
                                        },
                                        select: {
                                            id: true,
                                            code: true,
                                            name: true,
                                            phone: true,
                                            email: true,
                                            address: true,
                                            group: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    discountRate: true,
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.customer.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), customers = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    items: customers,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        return PosService_1;
    }());
    __setFunctionName(_classThis, "PosService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PosService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PosService = _classThis;
}();
exports.PosService = PosService;
var templateObject_1;
