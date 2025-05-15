import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateProductsTable1714994400002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'site_id',
            type: 'int',
          },
          {
            name: 'wc_product_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'short_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'regular_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'sale_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'stock',
            type: 'int',
            default: 0,
          },
          {
            name: 'stock_status',
            type: 'varchar',
            default: "'instock'",
          },
          {
            name: 'images',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'categories',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'attributes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            default: "'simple'",
          },
          {
            name: 'featured',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'synced_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_PRODUCTS_SITE_ID',
        columnNames: ['site_id'],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('products');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('site_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('products', foreignKey);
      }
    }
    await queryRunner.dropTable('products');
  }
}
