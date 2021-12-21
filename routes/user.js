const crypto = require("crypto");
const config = require("../config");
const db = require("../database");

const user = {
    login: (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                error: "Email or password missing",
            });
        } else {
            const hasher = crypto.createHmac("sha256", config.salt);
            const email = req.body.email;
            const pass = hasher.update(req.body.password).digest("hex");
            db.query(
                `
                SELECT id, name, password FROM users
                WHERE email = $1;
                `,
                [email],
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: error,
                        });
                    } else {
                        if (pass == result.rows[0].password)
                            res.json({
                                message: `Login successful, ${result.rows[0].name}!`,
                                user: result.rows[0],
                            });
                    }
                }
            );
        }
    },
    register: (req, res) => {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.status(400).json({
                error: "Username, email or password missing",
            });
        } else {
            const hasher = crypto.createHmac("sha256", config.salt);
            const name = req.body.name;
            const email = req.body.email;
            const pass = hasher.update(req.body.password).digest("hex");

            db.query(
                `
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, name, password;
                `,
                [name, email, pass],
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: error,
                        });
                    } else {
                        res.json({
                            message: `Created user ${req.body.name} with id ${result.rows[0].id}`,
                            user: result.rows[0],
                        });
                        console.log(result.rows[0]);
                    }
                }
            );
        }
    },
};

module.exports = user;
