import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('diets', (table) => {
        table.uuid('id').primary(),
        table.text('name').notNullable(),
        table.text('description'),
        table.timestamp('date').notNullable(),
        table.boolean('isInDiet').notNullable(),
        table.integer("user_id").unsigned(),
        table.timestamp('created_at').defaultTo(knex.fn.now()),
        table.timestamp('updated_at').defaultTo(knex.fn.now()),
        table.foreign('user_id').references('id').inTable('users');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('diets');
}