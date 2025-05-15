import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePostsTable1714994400001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
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
            name: 'wp_post_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'excerpt',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'meta',
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
            name: 'tags',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'draft'",
          },
          {
            name: 'seo_score',
            type: 'int',
            default: 0,
            isNullable: true,
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
      true,    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_SITE_ID',
        columnNames: ['site_id'],
      }),
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_SLUG',
        columnNames: ['slug'],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('posts');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('site_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('posts', foreignKey);
      }
    }
    await queryRunner.dropTable('posts');
  }
}
