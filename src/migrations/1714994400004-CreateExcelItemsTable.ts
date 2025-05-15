import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateExcelItemsTable1714994400004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'excel_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'upload_id',
            type: 'int',
          },
          {
            name: 'row_number',
            type: 'int',
          },
          {
            name: 'data',
            type: 'jsonb',
          },
          {
            name: 'valid',
            type: 'boolean',
            default: true,
          },
          {
            name: 'error_messages',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'ready_to_post',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_item_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_item_type',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,    );

    await queryRunner.createIndex(
      'excel_items',
      new TableIndex({
        name: 'IDX_EXCEL_ITEMS_UPLOAD_ID',
        columnNames: ['upload_id'],
      }),
    );

    await queryRunner.createIndex(
      'excel_items',
      new TableIndex({
        name: 'IDX_EXCEL_ITEMS_READY_TO_POST',
        columnNames: ['ready_to_post'],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('excel_items');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('upload_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('excel_items', foreignKey);
      }
    }
    await queryRunner.dropTable('excel_items');
  }
}
