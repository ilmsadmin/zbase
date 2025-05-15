import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLastSyncDateToSites1684078123456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'sites',
      new TableColumn({
        name: 'last_sync_date',
        type: 'timestamp',
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sites', 'last_sync_date');
  }
}