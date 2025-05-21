# Inventory and Customer Management Modules

This folder contains the implementation of the Inventory, Customer, and CustomerGroups modules for the ZBase system.

## Structure

### Inventory Module
- `inventory.module.ts`: Module definition for Inventory management
- `inventory.controller.ts`: REST API endpoints for inventory management
- `inventory.service.ts`: Business logic for inventory operations
- `dto/`: Data Transfer Objects for inventory operations
- `inventory.*.spec.ts`: Test files

### Customers Module
- `customers.module.ts`: Module definition for Customer management
- `customers.controller.ts`: REST API endpoints for customers
- `customers.service.ts`: Business logic for customer operations
- `dto/`: Data Transfer Objects for customer operations
- `customers.*.spec.ts`: Test files

### Customer Groups Module
- `customer-groups.module.ts`: Module definition for CustomerGroups management
- `customer-groups.controller.ts`: REST API endpoints for customer groups
- `customer-groups.service.ts`: Business logic for customer group operations
- `dto/`: Data Transfer Objects for customer group operations
- `customer-groups.*.spec.ts`: Test files

## Important Notes

These modules currently require schema updates in the Prisma configuration to match the implementation. The modules are temporarily commented out in `app.module.ts` until the schema updates are applied.

### Required Schema Updates:

1. **For the Inventory module:**
   - Ensure Inventory model has the `locationId` field
   - Ensure InventoryTransaction model has the correct fields matching the DTO

2. **For the Customers & CustomerGroups modules:**
   - Ensure CustomerGroup model is correctly defined in the schema
   - Ensure relationships between Customer and CustomerGroup are correct
   - Ensure PriceList relation with CustomerGroup is defined

## API Endpoints

### Inventory Module
- `GET /inventory`: Get list of inventory items with filtering options
- `GET /inventory/:id`: Get specific inventory item
- `POST /inventory`: Create new inventory item
- `PATCH /inventory/:id`: Update inventory item
- `DELETE /inventory/:id`: Delete inventory item
- `POST /inventory/transactions`: Create inventory transaction
- `GET /inventory/transactions`: Get list of inventory transactions
- `GET /inventory/transactions/:id`: Get specific transaction

### Customers Module
- `GET /customers`: Get list of customers with filtering options
- `GET /customers/:id`: Get customer details
- `POST /customers`: Create new customer
- `PATCH /customers/:id`: Update customer
- `DELETE /customers/:id`: Delete customer

### Customer Groups Module
- `GET /customer-groups`: Get list of customer groups
- `GET /customer-groups/:id`: Get customer group details
- `POST /customer-groups`: Create new customer group
- `PATCH /customer-groups/:id`: Update customer group
- `DELETE /customer-groups/:id`: Delete customer group

## Permissions

Ensure the following permissions are assigned to users who need to access these modules:

### Inventory Permissions
- `inventory.create`
- `inventory.read`
- `inventory.update`
- `inventory.delete`
- `inventory.transactions.create`
- `inventory.transactions.read`

### Customer Permissions
- `customers.create`
- `customers.read`
- `customers.update`
- `customers.delete`

### Customer Groups Permissions
- `customer-groups.create`
- `customer-groups.read`
- `customer-groups.update`
- `customer-groups.delete`
