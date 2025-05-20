import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu hiện có để tránh trùng lặp
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.invoiceDetail.deleteMany();
  await prisma.warranty.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  console.log('Đã xóa dữ liệu hiện có');

  // Tạo các roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Quản trị viên có toàn quyền',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
      description: 'Người dùng thông thường',
    },
  });

  const posRole = await prisma.role.create({
    data: {
      name: 'POS',
      description: 'Nhân viên bán hàng',
    },
  });

  console.log('Đã tạo roles');

  // Tạo các permissions cơ bản
  const basePermissions = await Promise.all([
    prisma.permission.create({
      data: { action: 'create:user', description: 'Tạo người dùng' },
    }),
    prisma.permission.create({
      data: { action: 'read:user', description: 'Xem người dùng' },
    }),
    prisma.permission.create({
      data: { action: 'update:user', description: 'Cập nhật người dùng' },
    }),
    prisma.permission.create({
      data: { action: 'delete:user', description: 'Xóa người dùng' },
    }),
    prisma.permission.create({
      data: { action: 'create:post', description: 'Tạo bài viết' },
    }),
    prisma.permission.create({
      data: { action: 'read:post', description: 'Xem bài viết' },
    }),
    prisma.permission.create({
      data: { action: 'update:post', description: 'Cập nhật bài viết' },
    }),
    prisma.permission.create({
      data: { action: 'delete:post', description: 'Xóa bài viết' },
    }),
    prisma.permission.create({
      data: { action: 'create:comment', description: 'Tạo bình luận' },
    }),
    prisma.permission.create({
      data: { action: 'read:comment', description: 'Xem bình luận' },
    }),
    prisma.permission.create({
      data: { action: 'update:comment', description: 'Cập nhật bình luận' },
    }),
    prisma.permission.create({
      data: { action: 'delete:comment', description: 'Xóa bình luận' },
    }),
    prisma.permission.create({
      data: { action: 'manage:all', description: 'Quản lý toàn bộ hệ thống' },
    }),
  ]);

  // Tạo các permissions cho POS
  const posPermissions = await Promise.all([
    // Warehouse permissions
    prisma.permission.create({
      data: { action: 'create:warehouse', description: 'Tạo kho hàng' },
    }),
    prisma.permission.create({
      data: { action: 'read:warehouse', description: 'Xem kho hàng' },
    }),
    prisma.permission.create({
      data: { action: 'update:warehouse', description: 'Cập nhật kho hàng' },
    }),
    prisma.permission.create({
      data: { action: 'delete:warehouse', description: 'Xóa kho hàng' },
    }),
    // Product permissions
    prisma.permission.create({
      data: { action: 'create:product', description: 'Tạo sản phẩm' },
    }),
    prisma.permission.create({
      data: { action: 'read:product', description: 'Xem sản phẩm' },
    }),
    prisma.permission.create({
      data: { action: 'update:product', description: 'Cập nhật sản phẩm' },
    }),
    prisma.permission.create({
      data: { action: 'delete:product', description: 'Xóa sản phẩm' },
    }),
    // Category permissions
    prisma.permission.create({
      data: { action: 'create:category', description: 'Tạo danh mục' },
    }),
    prisma.permission.create({
      data: { action: 'read:category', description: 'Xem danh mục' },
    }),
    prisma.permission.create({
      data: { action: 'update:category', description: 'Cập nhật danh mục' },
    }),
    prisma.permission.create({
      data: { action: 'delete:category', description: 'Xóa danh mục' },
    }),
    // Inventory permissions
    prisma.permission.create({
      data: { action: 'read:inventory', description: 'Xem tồn kho' },
    }),
    prisma.permission.create({
      data: { action: 'import:inventory', description: 'Nhập kho' },
    }),
    prisma.permission.create({
      data: { action: 'export:inventory', description: 'Xuất kho' },
    }),
    // Customer permissions
    prisma.permission.create({
      data: { action: 'create:customer', description: 'Tạo khách hàng' },
    }),
    prisma.permission.create({
      data: { action: 'read:customer', description: 'Xem khách hàng' },
    }),
    prisma.permission.create({
      data: { action: 'update:customer', description: 'Cập nhật khách hàng' },
    }),
    prisma.permission.create({
      data: { action: 'delete:customer', description: 'Xóa khách hàng' },
    }),
    // Partner permissions
    prisma.permission.create({
      data: { action: 'create:partner', description: 'Tạo đối tác' },
    }),
    prisma.permission.create({
      data: { action: 'read:partner', description: 'Xem đối tác' },
    }),
    prisma.permission.create({
      data: { action: 'update:partner', description: 'Cập nhật đối tác' },
    }),
    prisma.permission.create({
      data: { action: 'delete:partner', description: 'Xóa đối tác' },
    }),
    // Invoice permissions
    prisma.permission.create({
      data: { action: 'create:invoice', description: 'Tạo hóa đơn' },
    }),
    prisma.permission.create({
      data: { action: 'read:invoice', description: 'Xem hóa đơn' },
    }),
    prisma.permission.create({
      data: { action: 'update:invoice', description: 'Cập nhật hóa đơn' },
    }),
    prisma.permission.create({
      data: { action: 'delete:invoice', description: 'Xóa hóa đơn' },
    }),
    // Transaction permissions
    prisma.permission.create({
      data: { action: 'create:transaction', description: 'Tạo phiếu thu/chi' },
    }),
    prisma.permission.create({
      data: { action: 'read:transaction', description: 'Xem phiếu thu/chi' },
    }),
    prisma.permission.create({
      data: { action: 'update:transaction', description: 'Cập nhật phiếu thu/chi' },
    }),
    prisma.permission.create({
      data: { action: 'delete:transaction', description: 'Xóa phiếu thu/chi' },
    }),
    // Warranty permissions
    prisma.permission.create({
      data: { action: 'create:warranty', description: 'Tạo bảo hành' },
    }),
    prisma.permission.create({
      data: { action: 'read:warranty', description: 'Xem bảo hành' },
    }),
    prisma.permission.create({
      data: { action: 'update:warranty', description: 'Cập nhật bảo hành' },
    }),
    prisma.permission.create({
      data: { action: 'delete:warranty', description: 'Xóa bảo hành' },
    }),
    // Shift permissions
    prisma.permission.create({
      data: { action: 'create:shift', description: 'Tạo ca làm việc' },
    }),
    prisma.permission.create({
      data: { action: 'read:shift', description: 'Xem ca làm việc' },
    }),
    prisma.permission.create({
      data: { action: 'update:shift', description: 'Cập nhật ca làm việc' },
    }),
    // Report permissions
    prisma.permission.create({
      data: { action: 'read:report', description: 'Xem báo cáo' },
    }),
  ]);

  const allPermissions = [...basePermissions, ...posPermissions];
  console.log('Đã tạo permissions');

  // Gán tất cả permissions cho ADMIN
  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Gán một số permissions cơ bản cho USER
  const userPermissions = basePermissions.filter(
    (p) => 
      p.action === 'read:user' || 
      p.action.startsWith('read:post') || 
      p.action.startsWith('create:post') ||
      p.action.startsWith('read:comment') ||
      p.action.startsWith('create:comment')
  );

  for (const permission of userPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Gán permissions cho POS
  const posOnlyPermissions = posPermissions.filter(
    (p) => 
      p.action.startsWith('read:') ||
      p.action === 'create:customer' ||
      p.action === 'update:customer' ||
      p.action === 'create:invoice' ||
      p.action === 'create:warranty' ||
      p.action === 'create:shift' ||
      p.action === 'update:shift'
  );

  for (const permission of posOnlyPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: posRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('Đã gán permissions cho roles');

  // Tạo tài khoản admin mặc định
  const adminPassword = await bcrypt.hash('password', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });

  // Tạo tài khoản admin mới theo yêu cầu
  const toanPassword = await bcrypt.hash('ToanLinh', 10);
  const toan = await prisma.user.create({
    data: {
      email: 'toan@zplus.vn',
      password: toanPassword,
      name: 'Toan Admin',
    },
  });

  // Tạo tài khoản user mặc định
  const userPassword = await bcrypt.hash('password', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Normal User',
    },
  });

  // Tạo tài khoản nhân viên POS
  const posPassword = await bcrypt.hash('password', 10);
  const posUser = await prisma.user.create({
    data: {
      email: 'pos@example.com',
      password: posPassword,
      name: 'POS Staff',
    },
  });

  console.log('Đã tạo tài khoản người dùng');

  // Gán roles cho users
  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: toan.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: userRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: posUser.id,
      roleId: posRole.id,
    },
  });

  console.log('Đã gán roles cho users');

  // Tạo một số bài viết mẫu
  const post1 = await prisma.post.create({
    data: {
      title: 'Bài viết đầu tiên',
      content: 'Nội dung bài viết đầu tiên từ admin',
      published: true,
      authorId: admin.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Bài viết từ user',
      content: 'Nội dung bài viết từ user thông thường',
      published: true,
      authorId: user.id,
    },
  });

  console.log('Đã tạo bài viết mẫu');

  // Tạo một số bình luận mẫu
  await prisma.comment.create({
    data: {
      content: 'Bình luận đầu tiên về bài viết',
      postId: post1.id,
      authorId: user.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Bình luận từ admin',
      postId: post2.id,
      authorId: admin.id,
    },
  });

  console.log('Đã tạo bình luận mẫu');

  // Tạo dữ liệu mẫu cho hệ thống POS

  // 1. Tạo các kho hàng
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Kho Chính',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      managerId: admin.id,
    },
  });

  const secondaryWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Kho Phụ',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      managerId: toan.id,
    },
  });

  console.log('Đã tạo kho hàng mẫu');

  // 2. Tạo danh mục sản phẩm
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Điện tử',
      description: 'Các sản phẩm điện tử, thiết bị điện tử',
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      name: 'Quần áo',
      description: 'Các sản phẩm thời trang, quần áo',
    },
  });

  const furnitureCategory = await prisma.category.create({
    data: {
      name: 'Nội thất',
      description: 'Các sản phẩm nội thất, trang trí nhà cửa',
    },
  });

  console.log('Đã tạo danh mục sản phẩm mẫu');

  // 3. Tạo sản phẩm
  const laptop = await prisma.product.create({
    data: {
      code: 'LAPTOP001',
      name: 'Laptop Asus Gaming ROG',
      categoryId: electronicsCategory.id,
      price: 25000000,
      attributes: {
        brand: 'Asus',
        model: 'ROG Strix G15',
        color: 'Black',
        ram: '16GB',
        storage: '512GB SSD',
      },
    },
  });

  const smartphone = await prisma.product.create({
    data: {
      code: 'PHONE001',
      name: 'Điện thoại Samsung Galaxy S23',
      categoryId: electronicsCategory.id,
      price: 18000000,
      attributes: {
        brand: 'Samsung',
        model: 'Galaxy S23',
        color: 'Phantom Black',
        ram: '8GB',
        storage: '256GB',
      },
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      code: 'SHIRT001',
      name: 'Áo thun nam Nike',
      categoryId: clothingCategory.id,
      price: 450000,
      attributes: {
        brand: 'Nike',
        size: ['S', 'M', 'L', 'XL'],
        color: ['Đen', 'Trắng', 'Xanh'],
        material: 'Cotton',
      },
    },
  });

  const jeans = await prisma.product.create({
    data: {
      code: 'JEANS001',
      name: 'Quần jeans nam Levi\'s',
      categoryId: clothingCategory.id,
      price: 1200000,
      attributes: {
        brand: 'Levi\'s',
        size: ['29', '30', '31', '32', '33', '34'],
        color: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
        material: 'Denim',
      },
    },
  });

  const sofa = await prisma.product.create({
    data: {
      code: 'SOFA001',
      name: 'Sofa da cao cấp',
      categoryId: furnitureCategory.id,
      price: 15000000,
      attributes: {
        brand: 'IKEA',
        material: 'Da thật',
        color: ['Nâu', 'Đen', 'Be'],
        size: '3 chỗ ngồi',
      },
    },
  });

  console.log('Đã tạo sản phẩm mẫu');

  // 4. Cập nhật tồn kho
  await prisma.inventory.create({
    data: {
      productId: laptop.id,
      warehouseId: mainWarehouse.id,
      quantity: 10,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: smartphone.id,
      warehouseId: mainWarehouse.id,
      quantity: 20,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: tshirt.id,
      warehouseId: mainWarehouse.id,
      quantity: 50,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: jeans.id,
      warehouseId: mainWarehouse.id,
      quantity: 30,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: sofa.id,
      warehouseId: mainWarehouse.id,
      quantity: 5,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: laptop.id,
      warehouseId: secondaryWarehouse.id,
      quantity: 5,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: smartphone.id,
      warehouseId: secondaryWarehouse.id,
      quantity: 10,
    },
  });

  console.log('Đã cập nhật tồn kho mẫu');

  // 5. Tạo khách hàng
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      address: '789 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Trần Thị B',
      phone: '0909876543',
      email: 'tranthib@example.com',
      address: '456 Đường Lê Đại Hành, Quận 11, TP.HCM',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Phạm Văn C',
      phone: '0918765432',
      email: 'phamvanc@example.com',
      address: '123 Đường Nguyễn Trãi, Quận 5, TP.HCM',
      debt: 1500000,
    },
  });

  console.log('Đã tạo khách hàng mẫu');

  // 6. Tạo đối tác
  const supplier1 = await prisma.partner.create({
    data: {
      name: 'Công ty TNHH Điện tử XYZ',
      type: 'SUPPLIER',
      contact: {
        phone: '0283123456',
        email: 'contact@xyz.com',
        address: '123 Đường Võ Văn Kiệt, Quận 1, TP.HCM',
        contactPerson: 'Lê Văn D',
      },
    },
  });

  const supplier2 = await prisma.partner.create({
    data: {
      name: 'Công ty CP Thời trang ABC',
      type: 'SUPPLIER',
      contact: {
        phone: '0283789012',
        email: 'contact@abc.com',
        address: '456 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM',
        contactPerson: 'Hoàng Thị E',
      },
      debt: 5000000,
    },
  });

  const wholesaler1 = await prisma.partner.create({
    data: {
      name: 'Cửa hàng Điện máy MNO',
      type: 'WHOLESALER',
      contact: {
        phone: '0283456789',
        email: 'sales@mno.com',
        address: '789 Đường Quang Trung, Quận Gò Vấp, TP.HCM',
        contactPerson: 'Trương Văn F',
      },
    },
  });

  console.log('Đã tạo đối tác mẫu');

  // 7. Tạo ca làm việc
  const shift1 = await prisma.shift.create({
    data: {
      employeeId: posUser.id,
      startTime: new Date('2025-05-20T08:00:00Z'),
      endTime: new Date('2025-05-20T17:00:00Z'),
      initialCash: 2000000,
      finalCash: 5000000,
      revenue: 3000000,
    },
  });

  const shift2 = await prisma.shift.create({
    data: {
      employeeId: posUser.id,
      startTime: new Date('2025-05-19T08:00:00Z'),
      endTime: new Date('2025-05-19T17:00:00Z'),
      initialCash: 2000000,
      finalCash: 4500000,
      revenue: 2500000,
    },
  });

  console.log('Đã tạo ca làm việc mẫu');

  // 8. Tạo hóa đơn
  const invoice1 = await prisma.invoice.create({
    data: {
      customerId: customer1.id,
      warehouseId: mainWarehouse.id,
      employeeId: posUser.id,
      totalAmount: 25450000,
      status: 'PAID',
      createdAt: new Date('2025-05-19T10:30:00Z'),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      customerId: customer2.id,
      warehouseId: mainWarehouse.id,
      employeeId: posUser.id,
      totalAmount: 18000000,
      status: 'PAID',
      createdAt: new Date('2025-05-19T14:45:00Z'),
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      customerId: customer3.id,
      warehouseId: mainWarehouse.id,
      employeeId: posUser.id,
      totalAmount: 16200000,
      status: 'PENDING',
      createdAt: new Date('2025-05-20T09:15:00Z'),
    },
  });

  console.log('Đã tạo hóa đơn mẫu');

  // 9. Tạo chi tiết hóa đơn
  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice1.id,
      productId: laptop.id,
      quantity: 1,
      unitPrice: 25000000,
      discount: 0,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice1.id,
      productId: tshirt.id,
      quantity: 1,
      unitPrice: 450000,
      discount: 0,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice2.id,
      productId: smartphone.id,
      quantity: 1,
      unitPrice: 18000000,
      discount: 0,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice3.id,
      productId: sofa.id,
      quantity: 1,
      unitPrice: 15000000,
      discount: 0,
    },
  });

  await prisma.invoiceDetail.create({
    data: {
      invoiceId: invoice3.id,
      productId: jeans.id,
      quantity: 1,
      unitPrice: 1200000,
      discount: 0,
    },
  });

  console.log('Đã tạo chi tiết hóa đơn mẫu');

  // 10. Tạo giao dịch thu/chi
  await prisma.transaction.create({
    data: {
      type: 'RECEIPT',
      customerId: customer1.id,
      amount: 25450000,
      description: 'Thu tiền hóa đơn #' + invoice1.id,
      createdAt: new Date('2025-05-19T10:45:00Z'),
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'RECEIPT',
      customerId: customer2.id,
      amount: 18000000,
      description: 'Thu tiền hóa đơn #' + invoice2.id,
      createdAt: new Date('2025-05-19T15:00:00Z'),
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'PAYMENT',
      partnerId: supplier1.id,
      amount: 50000000,
      description: 'Thanh toán tiền hàng laptop và điện thoại',
      createdAt: new Date('2025-05-18T11:30:00Z'),
    },
  });

  console.log('Đã tạo giao dịch thu/chi mẫu');

  // 11. Tạo bảo hành
  await prisma.warranty.create({
    data: {
      invoiceId: invoice1.id,
      productId: laptop.id,
      customerId: customer1.id,
      startDate: new Date('2025-05-19T10:45:00Z'),
      endDate: new Date('2026-05-19T10:45:00Z'),
      status: 'ACTIVE',
    },
  });

  await prisma.warranty.create({
    data: {
      invoiceId: invoice2.id,
      productId: smartphone.id,
      customerId: customer2.id,
      startDate: new Date('2025-05-19T15:00:00Z'),
      endDate: new Date('2026-05-19T15:00:00Z'),
      status: 'ACTIVE',
    },
  });

  console.log('Đã tạo bảo hành mẫu');

  // 12. Tạo giao dịch kho
  await prisma.inventoryTransaction.create({
    data: {
      type: 'IMPORT',
      productId: laptop.id,
      warehouseId: mainWarehouse.id,
      quantity: 10,
      employeeId: admin.id,
      createdAt: new Date('2025-05-15T09:00:00Z'),
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      type: 'IMPORT',
      productId: smartphone.id,
      warehouseId: mainWarehouse.id,
      quantity: 20,
      employeeId: admin.id,
      createdAt: new Date('2025-05-15T09:30:00Z'),
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      type: 'EXPORT',
      productId: laptop.id,
      warehouseId: mainWarehouse.id,
      quantity: 1,
      employeeId: posUser.id,
      createdAt: new Date('2025-05-19T10:30:00Z'),
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      type: 'EXPORT',
      productId: smartphone.id,
      warehouseId: mainWarehouse.id,
      quantity: 1,
      employeeId: posUser.id,
      createdAt: new Date('2025-05-19T14:45:00Z'),
    },
  });

  console.log('Đã tạo giao dịch kho mẫu');

  console.log('Quá trình seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });