"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedCustomerPermissions() {
    console.log('Seeding customer permissions...');
    const customerPermissions = [
        { action: 'create:customer', description: 'Create customer' },
        { action: 'read:customer', description: 'Read customer information' },
        { action: 'update:customer', description: 'Update customer information' },
        { action: 'delete:customer', description: 'Delete customer' },
    ];
    for (const permission of customerPermissions) {
        await prisma.permission.upsert({
            where: { action: permission.action },
            update: {},
            create: permission,
        });
    }
    const adminRole = await prisma.role.findUnique({
        where: { name: 'admin' },
    });
    if (adminRole) {
        const permissions = await prisma.permission.findMany({
            where: {
                action: {
                    in: customerPermissions.map(p => p.action),
                },
            },
        });
        for (const permission of permissions) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: adminRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            });
        }
    }
    const posRole = await prisma.role.findUnique({
        where: { name: 'pos' },
    });
    if (posRole) {
        const permissions = await prisma.permission.findMany({
            where: {
                action: {
                    in: ['read:customer', 'create:customer', 'update:customer'],
                },
            },
        });
        for (const permission of permissions) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: posRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: posRole.id,
                    permissionId: permission.id,
                },
            });
        }
    }
    console.log('Customer permissions seeded successfully!');
}
async function main() {
    try {
        await seedCustomerPermissions();
    }
    catch (error) {
        console.error('Error seeding customer permissions:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=customers-permissions.js.map