export function up(knex) {
    return knex.schema.createTable('user', function(table) {
      table.increments('user_id').unsigned().notNullable();
      table.string('user_login', 50).collate('utf16_general_ci').unique();
      table.string('user_pwd', 100).collate('utf16_general_ci');
      table.string('user_firstname', 100).collate('utf16_general_ci');
      table.string('user_lastname', 100).collate('utf16_general_ci');
      table.string('user_status', 20).defaultTo('active').collate('utf16_general_ci');
      table.integer('user_role_id', 11).defaultTo(1);
      table.tinyint('is_reset_password', 1).defaultTo(1);
      table.timestamp('cdate').defaultTo(knex.fn.now());
    });
  }
  
  export function down(knex) {
    return knex.schema.dropTable('user');
  }