import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateExcelUploadsTable1714994400003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'excel_uploads',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'originalname',
            type: 'varchar',
          },
          {
            name: 'mimetype',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar', // 'posts' hoặc 'products'
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'", // 'pending', 'processed', 'completed', 'error'
          },
          {
            name: 'error_log',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'uploaded_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,    );

    await queryRunner.createIndex(
      'excel_uploads',
      new TableIndex({
        name: 'IDX_EXCEL_UPLOADS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'excel_uploads',
      new TableIndex({
        name: 'IDX_EXCEL_UPLOADS_STATUS',
        columnNames: ['status'],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('excel_uploads');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('excel_uploads', foreignKey);
      }
    }
    await queryRunner.dropTable('excel_uploads');
  }
}
