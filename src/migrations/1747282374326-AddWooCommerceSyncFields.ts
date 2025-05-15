import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWooCommerceSyncFields1747282374326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products 
            ADD COLUMN wc_sync_status VARCHAR(255) DEFAULT 'pending',
            ADD COLUMN wc_error TEXT NULL,
            ADD COLUMN wc_last_sync_attempt TIMESTAMP NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products 
            DROP COLUMN wc_sync_status,
            DROP COLUMN wc_error,
            DROP COLUMN wc_last_sync_attempt
        `);
    }

}
