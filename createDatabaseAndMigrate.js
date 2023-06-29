import dotenv from 'dotenv';
import knex from 'knex';
import { seedAdminUser } from './seeds/adminSeed.js';

dotenv.config();

// Create a new instance of the Knex builder
const knexBuilder = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'mysql', // Connect to the default "mysql" database
    },
});

// Create the new database
knexBuilder
    .raw(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`)
    .then(() => {
        console.log(`Database "${process.env.DB_NAME}" created successfully.`);
        // Close the initial connection to the default "mysql" database
        knexBuilder.destroy();

        // Create a new instance of the Knex builder for the newly created database
        const knexConfig = {
            client: 'mysql2',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            },
            migrations: {
                directory: './migrations',
            },

        };

        const knexMigrate = knex(knexConfig);

        // Perform database migrations
        knexMigrate.migrate.latest()
            .then(() => {
                console.log('Database migrations completed successfully.');
                knexMigrate.destroy(); // Close the database connection
            })
            .catch((error) => {
                console.error('Error performing database migrations:', error);
                knexMigrate.destroy(); // Close the database connection
            });
    })
    .catch((error) => {
        console.error('Error creating database:', error);
        knexBuilder.destroy(); // Close the database connection
    });
