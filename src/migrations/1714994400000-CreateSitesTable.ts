import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSitesTable1714994400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sites',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'wp_url',
            type: 'varchar',
          },
          {
            name: 'wp_user',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'app_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'wc_key',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'wc_secret',
            type: 'varchar',
            isNullable: true,
          },          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'has_woocommerce',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'sites',
      new TableIndex({
        name: 'IDX_SITES_WP_URL',
        columnNames: ['wp_url'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sites');
  }
}
