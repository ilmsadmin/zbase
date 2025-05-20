import { Prisma } from '@prisma/client';

/**
 * Middleware Prisma để tự động cập nhật tồn kho khi tạo hoặc cập nhật hóa đơn
 * Middleware này sẽ được đăng ký trong Prisma Service
 */
export const inventoryMiddleware: Prisma.Middleware = async (
  params,
  next,
) => {
  const result = await next(params);

  // Xử lý cập nhật tồn kho khi tạo hóa đơn
  if (params.model === 'Invoice' && params.action === 'create') {
    // Lấy thông tin chi tiết hóa đơn từ dữ liệu gửi lên
    const invoice = result as any;
    
    // Nếu có dữ liệu invoiceDetails trong input, xử lý để cập nhật tồn kho
    // Điều này phụ thuộc vào cách bạn triển khai API tạo hóa đơn
    if (params.args.data.invoiceDetails) {
      // Giả sử invoiceDetails là một mảng các chi tiết hóa đơn
      const invoiceDetails = params.args.data.invoiceDetails.create || [];
        // Lặp qua từng chi tiết hóa đơn để cập nhật tồn kho
      for (const detail of Array.isArray(invoiceDetails) ? invoiceDetails : [invoiceDetails]) {
        // Thực hiện cập nhật tồn kho
        await updateInventory(
          params.args.data.warehouseId,
          detail.productId,
          detail.quantity,
          params.args.data.employeeId,
          (params as any).prisma || (params as any).client, // Lấy prisma client với type assertion
        );
      }
    }
  }

  return result;
};

/**
 * Hàm cập nhật tồn kho và tạo giao dịch kho
 */
async function updateInventory(
  warehouseId: number,
  productId: number,
  quantity: number,
  employeeId: number,
  prisma: any,
) {
  // Tìm tồn kho hiện tại
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

  // Cập nhật tồn kho
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

  // Tạo giao dịch kho
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
