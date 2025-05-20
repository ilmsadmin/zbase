// MongoDB initialization script for ZBase
// This script creates MongoDB collections for ZBase

db = db.getSiblingDB('zbase');

// First, drop existing collections if they exist
try {
  db.inventory_logs.drop();
} catch (e) {}

try {
  db.sales_analytics.drop();
} catch (e) {}

try {
  db.analytics_reports.drop();
} catch (e) {}

try {
  db.forecasting_models.drop();
} catch (e) {}

// Create collections without validation for now
db.createCollection('inventory_logs');
db.inventory_logs.createIndex({ 'productId': 1 });
db.inventory_logs.createIndex({ 'warehouseId': 1 });
db.inventory_logs.createIndex({ 'createdAt': -1 });
db.inventory_logs.createIndex({ 'actionType': 1 });
db.inventory_logs.createIndex({ 'referenceId': 1, 'referenceType': 1 });

// Create sales_analytics collection
db.createCollection('sales_analytics');
db.sales_analytics.createIndex({ 'date': -1 });
db.sales_analytics.createIndex({ 'warehouseId': 1 });

// Create analytics_reports collection
db.createCollection('analytics_reports');
db.analytics_reports.createIndex({ 'createdAt': -1 });
db.analytics_reports.createIndex({ 'type': 1 });
db.analytics_reports.createIndex({ 'userId': 1 });

// Create forecasting_models collection
db.createCollection('forecasting_models');
db.forecasting_models.createIndex({ 'targetEntity': 1, 'targetId': 1 });
db.forecasting_models.createIndex({ 'modelName': 1 });
db.forecasting_models.createIndex({ 'active': 1 });

// Insert a test document
db.inventory_logs.insertOne({
  productId: 1, 
  productName: 'Test Product', 
  productCode: 'TP001', 
  warehouseId: 1, 
  warehouseName: 'Main Warehouse', 
  actionType: 'import', 
  quantity: 10.0, 
  createdAt: new Date()
});

print('MongoDB collections created with indexes and test document');