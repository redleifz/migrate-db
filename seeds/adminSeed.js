import bcrypt from "bcryptjs";
import { seedConfig, dbConfig } from "../config.js";
import mysql from 'mysql2'

// Database connection configuration




// Create a MySQL connection pool
const connection = mysql.createConnection(dbConfig);

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
        seedAdminUser();
    }
});


export function seedAdminUser() {
    const adminUser = {
        username: seedConfig.admin_username,
        password: seedConfig.admin_password,
        firstname: 'admin',
        lastname: 'isoftel',
        roleId: 3
    };

    bcrypt.hash(adminUser.password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            connection.end()
            return;
        }

        const insertQuery = `INSERT INTO user (user_login, user_pwd, user_firstname, user_lastname, user_role_id) VALUES (?, ?, ?, ?, ?)`;
        const values = [adminUser.username, hashedPassword, adminUser.firstname, adminUser.lastname, adminUser.roleId];

        connection.query(insertQuery, values, (error, results) => {
            if (error) {
                console.error('Error seeding admin user:', error);
            } else {
                console.log('Admin user seeded successfully');
            }

            connection.end();
        });
    });
}
