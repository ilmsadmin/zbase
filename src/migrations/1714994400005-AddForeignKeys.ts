import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeys1714994400005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign key for posts table
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['site_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sites',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for products table
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['site_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sites',
        onDelete: 'CASCADE',
      }),
    );    // We'll add the foreign key for excel_uploads later when users table exists
    // await queryRunner.createForeignKey(
    //   'excel_uploads',
    //   new TableForeignKey({
    //     columnNames: ['user_id'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'users',
    //     onDelete: 'CASCADE',
    //   }),
    // );

    // Add foreign key for excel_items table
    await queryRunner.createForeignKey(
      'excel_items',
      new TableForeignKey({
        columnNames: ['upload_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'excel_uploads',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const postsTable = await queryRunner.getTable('posts');
    if (postsTable) {
      const postsForeignKey = postsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('site_id') !== -1,
      );
      if (postsForeignKey) {
        await queryRunner.dropForeignKey('posts', postsForeignKey);
      }
    }

    const productsTable = await queryRunner.getTable('products');
    if (productsTable) {
      const productsForeignKey = productsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('site_id') !== -1,
      );
      if (productsForeignKey) {
        await queryRunner.dropForeignKey('products', productsForeignKey);
      }
    }    const excelItemsTable = await queryRunner.getTable('excel_items');
    if (excelItemsTable) {
      const excelItemsForeignKey = excelItemsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('upload_id') !== -1,
      );
      if (excelItemsForeignKey) {
        await queryRunner.dropForeignKey('excel_items', excelItemsForeignKey);
      }
    }    // We'll handle excel_uploads foreign key later when users table exists
    // const excelUploadsTable = await queryRunner.getTable('excel_uploads');
    // if (excelUploadsTable) {
    //   const excelUploadsForeignKey = excelUploadsTable.foreignKeys.find(
    //     (fk) => fk.columnNames.indexOf('user_id') !== -1,
    //   );
    //   if (excelUploadsForeignKey) {
    //     await queryRunner.dropForeignKey('excel_uploads', excelUploadsForeignKey);
    //   }
    // }
  }
}
