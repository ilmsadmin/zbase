# ZBase API Documentation

This document provides a comprehensive list of all API endpoints available in the ZBase backend system.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Roles & Permissions](#roles--permissions)
- [Products](#products)
- [Product Categories](#product-categories)
- [Product Attributes](#product-attributes)
- [Inventory](#inventory)
- [Warehouses](#warehouses)
- [Warehouse Locations](#warehouse-locations)
- [Customers](#customers)
- [Customer Groups](#customer-groups)
- [Partners](#partners)
- [Invoices](#invoices)
- [Transactions](#transactions)
- [POS (Point of Sale)](#pos-point-of-sale)
- [Shifts](#shifts)
- [Price Lists](#price-lists)
- [Reports](#reports)
- [Dashboard](#dashboard)
- [Report Templates](#report-templates)
- [Logs](#logs)
- [Posts](#posts)
- [Comments](#comments)
- [Warranties](#warranties)

---

## Authentication

Base URL: `/api/auth`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/login` | POST | Authenticates a user and returns a JWT token | None |
| `/register` | POST | Registers a new user | None |
| `/profile` | GET | Returns the profile of the authenticated user | JWT |
| `/logout` | POST | Logs out a user | JWT |
| `/refresh` | POST | Refreshes the JWT token | JWT |

---

## Users

Base URL: `/api/users`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all users | JWT, ADMIN role |
| `/` | POST | Creates a new user | JWT, ADMIN role |
| `/:id` | GET | Retrieves a specific user | JWT |
| `/:id` | PATCH | Updates a specific user | JWT, ADMIN role |
| `/:id` | DELETE | Deletes a specific user | JWT, ADMIN role |

---

## Roles & Permissions

### Roles

Base URL: `/api/roles`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all roles | JWT |
| `/` | POST | Creates a new role | JWT, ADMIN role |
| `/:id` | GET | Retrieves a specific role | JWT |
| `/:id` | PATCH | Updates a specific role | JWT, ADMIN role |
| `/:id` | DELETE | Deletes a specific role | JWT, ADMIN role |
| `/:id/users` | GET | Gets all users with a specific role | JWT |
| `/:id/permissions` | GET | Gets all permissions for a specific role | JWT |

### Permissions

Base URL: `/api/permissions`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all permissions | JWT, ADMIN role |
| `/discover` | GET | Discovers actions (deprecated) | JWT, ADMIN role |
| `/role/:roleId/permission/:permissionId` | POST | Assigns a permission to a role | JWT, ADMIN role |
| `/role/:roleId/permission/:permissionId` | DELETE | Removes a permission from a role | JWT, ADMIN role |
| `/role/:roleId` | GET | Gets permissions by role | JWT |
| `/user/:userId` | GET | Gets user permissions | JWT |
| `/:id` | PUT | Updates a permission | JWT, ADMIN role |
| `/normalize` | POST | Normalizes permissions | JWT, ADMIN role |

---

## Products

Base URL: `/api/products`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all products with optional filters | JWT, products.read permission |
| `/` | POST | Creates a new product | JWT, products.create permission |
| `/:id` | GET | Retrieves a specific product | JWT, products.read permission |
| `/:id` | PATCH | Updates a specific product | JWT, products.update permission |
| `/:id` | DELETE | Deletes a specific product | JWT, products.delete permission |

---

## Product Categories

Base URL: `/api/product-categories`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all product categories with optional filters | JWT, product-categories.read permission |
| `/` | POST | Creates a new product category | JWT, product-categories.create permission |
| `/:id` | GET | Retrieves a specific product category | JWT, product-categories.read permission |
| `/:id` | PATCH | Updates a specific product category | JWT, product-categories.update permission |
| `/:id` | DELETE | Deletes a specific product category | JWT, product-categories.delete permission |

---

## Product Attributes

Base URL: `/api/product-attributes`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all product attributes with optional filters | JWT, product-attributes.read permission |
| `/` | POST | Creates a new product attribute | JWT, product-attributes.create permission |
| `/bulk` | POST | Creates multiple product attributes | JWT, product-attributes.create permission |
| `/summary` | GET | Gets attribute summary | JWT, product-attributes.read permission |
| `/common-attributes` | GET | Gets common attributes | JWT, product-attributes.read permission |
| `/:id` | GET | Retrieves a specific product attribute | JWT, product-attributes.read permission |
| `/:id` | PATCH | Updates a specific product attribute | JWT, product-attributes.update permission |
| `/:id` | DELETE | Deletes a specific product attribute | JWT, product-attributes.delete permission |
| `/product/:productId` | DELETE | Deletes all attributes for a specific product | JWT, product-attributes.delete permission |

---

## Inventory

Base URL: `/api/inventory`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all inventory items with optional filters | JWT, inventory.read permission |
| `/` | POST | Creates a new inventory item | JWT, inventory.create permission |
| `/:id` | GET | Retrieves a specific inventory item | JWT, inventory.read permission |
| `/:id` | PATCH | Updates a specific inventory item | JWT, inventory.update permission |
| `/:id` | DELETE | Deletes a specific inventory item | JWT, inventory.delete permission |
| `/transactions` | GET | Retrieves all inventory transactions with filters | JWT, inventory.transactions.read permission |
| `/transactions` | POST | Creates a new inventory transaction | JWT, inventory.transactions.create permission |
| `/transactions/:id` | GET | Retrieves a specific inventory transaction | JWT, inventory.transactions.read permission |

---

## Warehouses

Base URL: `/api/warehouses`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all warehouses | JWT, warehouses.read permission |
| `/` | POST | Creates a new warehouse | JWT, warehouses.create permission |
| `/:id` | GET | Retrieves a specific warehouse | JWT, warehouses.read permission |
| `/:id` | PATCH | Updates a specific warehouse | JWT, warehouses.update permission |
| `/:id` | DELETE | Deletes a specific warehouse | JWT, warehouses.delete permission |

---

## Warehouse Locations

Base URL: `/api/warehouse-locations`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all warehouse locations with optional filters | JWT, warehouse-locations.read permission |
| `/` | POST | Creates a new warehouse location | JWT, warehouse-locations.create permission |
| `/:id` | GET | Retrieves a specific warehouse location | JWT, warehouse-locations.read permission |
| `/:id` | PATCH | Updates a specific warehouse location | JWT, warehouse-locations.update permission |
| `/:id` | DELETE | Deletes a specific warehouse location | JWT, warehouse-locations.delete permission |

---

## Customers

Base URL: `/api/customers`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all customers with optional filters | JWT, customers.read permission |
| `/` | POST | Creates a new customer | JWT, customers.create permission |
| `/:id` | GET | Retrieves a specific customer | JWT, customers.read permission |
| `/:id` | PATCH | Updates a specific customer | JWT, customers.update permission |
| `/:id` | DELETE | Deletes a specific customer | JWT, customers.delete permission |

---

## Customer Groups

Base URL: `/api/customer-groups`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all customer groups with optional search | JWT, customer-groups.read permission |
| `/` | POST | Creates a new customer group | JWT, customer-groups.create permission |
| `/:id` | GET | Retrieves a specific customer group | JWT, customer-groups.read permission |
| `/:id` | PATCH | Updates a specific customer group | JWT, customer-groups.update permission |
| `/:id` | DELETE | Deletes a specific customer group | JWT, customer-groups.delete permission |

---

## Partners

Base URL: `/api/partners`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all partners with optional filters | JWT, partners.read permission |
| `/` | POST | Creates a new partner | JWT, partners.create permission |
| `/:id` | GET | Retrieves a specific partner | JWT, partners.read permission |
| `/:id` | PATCH | Updates a specific partner | JWT, partners.update permission |
| `/:id` | DELETE | Deletes a specific partner | JWT, partners.delete permission |

---

## Invoices

Base URL: `/api/invoices`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all invoices with optional filters | JWT, invoices.read permission |
| `/` | POST | Creates a new invoice | JWT, invoices.create permission |
| `/:id` | GET | Retrieves a specific invoice | JWT, invoices.read permission |
| `/code/:code` | GET | Retrieves an invoice by code | JWT, invoices.read permission |
| `/:id` | PATCH | Updates a specific invoice | JWT, invoices.update permission |
| `/:id/cancel` | PATCH | Cancels a specific invoice | JWT, invoices.cancel permission |
| `/:id` | DELETE | Deletes a specific invoice | JWT, invoices.delete permission |

---

## Transactions

Base URL: `/api/transactions`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all transactions with optional filters | JWT, transactions.read permission |
| `/` | POST | Creates a new transaction | JWT, transactions.create permission |
| `/:id` | GET | Retrieves a specific transaction | JWT, transactions.read permission |
| `/:id` | PATCH | Updates a specific transaction | JWT, transactions.update permission |
| `/:id` | DELETE | Deletes a specific transaction | JWT, transactions.delete permission |

---

## POS (Point of Sale)

Base URL: `/api/pos`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/check-shift` | GET | Checks if a shift is active for the user | JWT, pos.read permission |
| `/quick-sale` | POST | Creates a quick sale | JWT, pos.create permission |
| `/check-inventory` | POST | Checks inventory availability | JWT, pos.read permission |
| `/dashboard` | GET | Gets POS dashboard data | JWT, pos.read permission |
| `/recent-sales` | GET | Gets recent sales | JWT, pos.read permission |
| `/product-search` | GET | Searches for products | JWT, pos.read permission |
| `/customer-search` | GET | Searches for customers | JWT, pos.read permission |

---

## Shifts

Base URL: `/api/shifts`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all shifts with optional filters | JWT, shifts.read permission |
| `/` | POST | Creates a new shift | JWT, shifts.create permission |
| `/current` | GET | Gets the current active shift for the user | JWT, shifts.read permission |
| `/:id` | GET | Retrieves a specific shift | JWT, shifts.read permission |
| `/:id` | PATCH | Updates a specific shift | JWT, shifts.update permission |
| `/:id/close` | PATCH | Closes a specific shift | JWT, shifts.update permission |
| `/:id/summary` | GET | Gets a summary for a specific shift | JWT, shifts.read permission |

---

## Price Lists

Base URL: `/api/price-lists`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all price lists with optional filters | JWT, price-lists.read permission |
| `/` | POST | Creates a new price list | JWT, price-lists.create permission |
| `/:id` | GET | Retrieves a specific price list | JWT, price-lists.read permission |
| `/:id` | PATCH | Updates a specific price list | JWT, price-lists.update permission |
| `/:id` | DELETE | Deletes a specific price list | JWT, price-lists.delete permission |
| `/:id/items` | POST | Adds an item to a price list | JWT, price-lists.update permission |
| `/:id/items` | GET | Gets all items in a price list | JWT, price-lists.read permission |

---

## Reports

Base URL: `/api/reports`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all reports with optional filters | JWT, admin/manager roles |
| `/` | POST | Creates a new report | JWT, admin role |
| `/:id` | GET | Retrieves a specific report | JWT, admin/manager roles |
| `/:id/download` | GET | Downloads a specific report | JWT, admin/manager roles |
| `/:id/generate` | POST | Generates a specific report | JWT, admin role |
| `/:id` | PATCH | Updates a specific report | JWT, admin role |
| `/:id` | DELETE | Deletes a specific report | JWT, admin role |
| `/upload-data` | POST | Uploads report data | JWT, admin role |

---

## Dashboard

Base URL: `/api/reports/dashboard`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/recent-sales` | GET | Gets recent sales/transactions for dashboard | JWT, reports.dashboard.read permission |
| `/top-products` | GET | Gets top selling products for dashboard | JWT, reports.dashboard.read permission |
| `/low-stock` | GET | Gets low stock products for dashboard | JWT, reports.dashboard.read permission |

---

## Report Templates

Base URL: `/api/report-templates`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all report templates | JWT |
| `/` | POST | Creates a new report template | JWT |
| `/:id` | GET | Retrieves a specific report template | JWT |
| `/:id` | PATCH | Updates a specific report template | JWT |
| `/:id` | DELETE | Deletes a specific report template | JWT |

---

## Logs

Base URL: `/api/logs`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all logs with optional filters | JWT, read:logs permission |
| `/inventory` | GET | Retrieves inventory logs with optional filters | JWT, read:logs permission |
| `/sales` | GET | Retrieves sales logs with optional filters | JWT, read:logs permission |
| `/warranty` | GET | Retrieves warranty logs with optional filters | JWT, read:logs permission |
| `/user-activity` | GET | Retrieves user activity logs with optional filters | JWT, read:logs permission |

---

## Posts

Base URL: `/api/posts`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all posts | JWT |
| `/` | POST | Creates a new post | JWT |
| `/:id` | GET | Retrieves a specific post | JWT |
| `/:id` | PATCH | Updates a specific post | JWT |
| `/:id` | DELETE | Deletes a specific post | JWT |

---

## Comments

Base URL: `/api/comments`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all comments for a post | JWT |
| `/` | POST | Creates a new comment | JWT |
| `/:id` | GET | Retrieves a specific comment | JWT |
| `/:id` | PATCH | Updates a specific comment | JWT |
| `/:id` | DELETE | Deletes a specific comment | JWT |

---

## Warranties

Base URL: `/api/warranties`

| Endpoint | Method | Description | Authorization |
| --- | --- | --- | --- |
| `/` | GET | Retrieves all warranties | JWT |
| `/` | POST | Creates a new warranty | JWT |
| `/:id` | GET | Retrieves a specific warranty | JWT |
| `/:id` | PATCH | Updates a specific warranty | JWT |
| `/:id` | DELETE | Deletes a specific warranty | JWT |

---

## API Base URL

The base URL for all API endpoints is: `/api`

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header as follows:
```
Authorization: Bearer <your_jwt_token>
```

## Responses

All API endpoints return responses in JSON format. Successful responses have a status code in the 2xx range, while error responses have a status code in the 4xx or 5xx range.

## Pagination

Many endpoints that return lists support pagination through the following query parameters:
- `page`: The page number (default: 1)
- `limit`: The number of items per page (default: 20)

## Filtering and Searching

Many list endpoints support filtering and searching through various query parameters. Refer to the specific endpoint documentation for the supported filters.

## Documentation

Swagger documentation is available at: `/api/docs`
