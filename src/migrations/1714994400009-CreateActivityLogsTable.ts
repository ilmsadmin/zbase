import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivityLogsTable1714994400009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'userName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'module',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'details',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdBy',
            type: 'varchar',
            default: "'system'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Add indexes for better query performance
    await queryRunner.createIndex(
      'activity_log',
      new TableIndex({
        name: 'IDX_ACTIVITY_USER_ID',
        columnNames: ['userId'],
      })
    );

    await queryRunner.createIndex(
      'activity_log',
      new TableIndex({
        name: 'IDX_ACTIVITY_ACTION',
        columnNames: ['action'],
      })
    );

    await queryRunner.createIndex(
      'activity_log',
      new TableIndex({
        name: 'IDX_ACTIVITY_CREATED_AT',
        columnNames: ['createdAt'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('activity_log', 'IDX_ACTIVITY_USER_ID');
    await queryRunner.dropIndex('activity_log', 'IDX_ACTIVITY_ACTION');
    await queryRunner.dropIndex('activity_log', 'IDX_ACTIVITY_CREATED_AT');
    await queryRunner.dropTable('activity_log');
  }
}
