const DB = require("pg").Pool;
const config = require("./config");

const db = new DB({
    user: config.dbuser,
    host: config.host,
    database: config.dbname,
    password: config.dbpass,
    posrt: 5432,
});

function setUp() {
    //  Setup
    db.query(
        `
        DROP TABLE IF EXISTS galaxies;
        CREATE TABLE galaxies (
            id serial PRIMARY KEY,
            text varchar(255),
            private boolean,
            createdat TIMESTAMP,
            updatedat TIMESTAMP
        );
        `,
        (error, result) => {
            if (error) {
                throw error;
            }
            console.log(result);
        }
    );

    db.query(
        `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id serial PRIMARY KEY,
            name varchar(255) NOT NULL,
            password varchar(255)
        );
        `,
        (error, result) => {
            if (error) {
                throw error;
            }
            console.log(result);
        }
    );
}

// setUp();

module.exports = db;
