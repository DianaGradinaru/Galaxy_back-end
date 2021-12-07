const DB = require("pg").Pool;
const config = require("./config");

const db = new DB({
    user: config.dbuser,
    host: config.host,
    database: config.dbname,
    password: config.dbpass,
    posrt: 5432,
});

//  Setup
// db.query(
//     `drop table if exists galaxies; create table galaxies (
//     id serial primary key,
//     text varchar(255),
//     private boolean,
//     createdAt timestamp,
//     updatedAt timestamp
// );`,
//     (error, result) => {
//         if (error) {
//             throw error;
//         }
//         console.log(result);
//     }
// );

// db.query(
//     `drop table if exists users; create table users (
//     id serial primary key,
//     name varchar(255) not null,
//     password varchar(255)
// )`,
//     (error, result) => {
//         if (error) {
//             throw error;
//         }
//         console.log(result);
//     }
// );

module.exports = db;
