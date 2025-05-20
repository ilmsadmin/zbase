"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryMiddleware = void 0;
const inventoryMiddleware = async (params, next) => {
    const result = await next(params);
    if (params.model === 'Invoice' && params.action === 'create') {
        const invoice = result;
        if (params.args.data.invoiceDetails) {
            const invoiceDetails = params.args.data.invoiceDetails.create || [];
            for (const detail of Array.isArray(invoiceDetails) ? invoiceDetails : [invoiceDetails]) {
                await updateInventory(params.args.data.warehouseId, detail.productId, detail.quantity, params.args.data.employeeId, params.prisma || params.client);
            }
        }
    }
    return result;
};
exports.inventoryMiddleware = inventoryMiddleware;
async function updateInventory(warehouseId, productId, quantity, employeeId, prisma) {
    const inventory = await prisma.inventory.findUnique({
        where: {
            productId_warehouseId: {
                productId,
                warehouseId,
            },
        },
    });
    if (!inventory) {
        throw new Error(`Sản phẩm không tồn tại trong kho này: Product ID ${productId}, Warehouse ID ${warehouseId}`);
    }
    if (inventory.quantity < quantity) {
        throw new Error(`Không đủ tồn kho: Hiện tại có ${inventory.quantity}, yêu cầu ${quantity}`);
    }
    await prisma.inventory.update({
        where: {
            productId_warehouseId: {
                productId,
                warehouseId,
            },
        },
        data: {
            quantity: {
                decrement: quantity,
            },
            lastUpdated: new Date(),
        },
    });
    await prisma.inventoryTransaction.create({
        data: {
            type: 'EXPORT',
            productId,
            warehouseId,
            quantity,
            employeeId,
        },
    });
}
//# sourceMappingURL=prisma.middleware.js.map