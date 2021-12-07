const crypto = require("crypto");
const config = require("../config");
const db = require("../database");

const user = {
    register: (req, res) => {
        if (!req.body.name || !req.body.password) {
            res.status(400).json({
                error: "Username or password missing",
            });
        } else {
            const hasher = crypto.createHmac("sha256", config.salt);

            db.query(
                `insert into users (name, password) values ($1, $2) returning id;`,
                [req.body.name, hasher.update(req.body.password).digest("hex")],
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: error,
                        });
                    } else {
                        res.json({
                            message: `Created user ${req.body.name} with id ${result.rows[0].id}`,
                        });
                    }
                }
            );
        }
    },
};

module.exports = user;
