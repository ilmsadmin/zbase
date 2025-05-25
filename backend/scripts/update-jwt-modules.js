// This script updates JwtModule.registerAsync to use direct environment variables
const fs = require('fs');
const path = require('path');

const modulesToUpdate = [
  'src/inventory/inventory.module.ts',
  'src/invoices/invoices.module.ts',
  'src/partners/partners.module.ts',
  'src/pos/pos.module.ts',
  'src/price-lists/price-lists.module.ts',
  'src/product-attributes/product-attributes.module.ts',
  'src/product-categories/product-categories.module.ts',
  'src/products/products.module.ts',
  'src/reports/reports.module.ts',
  'src/shifts/shifts.module.ts',
  'src/warehouse-locations/warehouse-locations.module.ts',
  'src/warehouses/warehouses.module.ts'
];

modulesToUpdate.forEach(modulePath => {
  const fullPath = path.resolve(__dirname, modulePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove ConfigService import
    content = content.replace(/import\s+{\s*ConfigService\s*}\s+from\s+['"]@nestjs\/config['"];?\s*/g, '');
    
    // Replace JwtModule.registerAsync with JwtModule.register
    content = content.replace(
      /JwtModule\.registerAsync\(\{\s*inject:\s*\[\s*ConfigService\s*\],\s*useFactory:\s*\(\s*configService:\s*ConfigService\s*\)\s*=>\s*\(\{\s*secret:\s*configService\.get(?:\(['"]?[\w\._-]+['"]?(?:,\s*['"][\w\._-]+['"])?(?:,\s*{[^}]*})?\)|\(.*?\)|[^,]+),\s*signOptions:\s*\{\s*expiresIn:\s*(['"][\w\d]+['"]),?\s*\},?\s*\}\)\s*,/g, 
      `JwtModule.register({\n      secret: process.env.APP_JWT_SECRET || 'super-secret',\n      signOptions: { expiresIn: $1 },\n    }),`
    );
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${modulePath}`);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('All modules updated successfully.');
