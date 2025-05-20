# Troubleshooting Guide

## Common Issues and Solutions

### MongoDB Connection Issues

If you encounter MongoDB connection errors (authentication failed):

1. Check that MongoDB is running and accessible with the configured credentials
2. Verify the connection string in `app.config.ts` is correct
3. Use the following temporary solution if needed:
   - Comment out MongoDB connection in `mongo.module.ts`
   - Ensure `LogsService` handles null MongoDB connection gracefully

### NestJS Dependency Injection Issues

If you encounter `UnknownDependenciesException` errors:

1. Ensure all required modules are imported where needed
2. For circular dependencies, use `forwardRef(() => Module)`
3. When using guards like `PermissionsGuard`, ensure the module imports `PermissionsModule`

Example fix for InventoryModule:
```typescript
@Module({
  imports: [PrismaModule, MongoModule, PermissionsModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
```

### TypeScript Type Errors

For TypeScript errors in strategies or middleware:

1. Use type assertions (`as any`) for complex objects when needed
2. Add explicit types for function parameters
3. Update interfaces when new properties are used

Example:
```typescript
// Update an interface when new properties are needed
export interface LogQueryOptions {
  // ...existing properties...
  details?: Record<string, any>; // Added new property
}
```

## Debug Tips

1. Check the terminal output for specific error messages
2. Use the `console.log()` method to debug specific parts of the code
3. Temporarily disable features that are causing errors to isolate issues
4. Add proper error handling in services

## Contact

If you encounter persistent issues, contact the development team at dev@zbase.example.com
