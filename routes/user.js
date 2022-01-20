const crypto = require("crypto");
const config = require("../config");
const db = require("../database");
const fs = require("fs");

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
                SELECT COUNT(g.id) as count, u.id, u.email, u.password, u.name, u.profile_pic FROM users u
                LEFT JOIN galaxies g ON u.id = g.user_id
                WHERE u.email = $1
                GROUP BY u.id
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
            const profile_pic = req.files.file.size
                ? fs.readFileSync(req.files.file.path).toString("base64")
                : "";

            db.query(
                `
                INSERT INTO users (name, email, password, profile_pic)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, password, profile_pic;
                `,
                [name, email, pass, profile_pic],
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
                    }
                }
            );
        }
    },
    profile: (req, res) => {
        const id = req.body.id;
        db.query(
            `
            SELECT COUNT(g.id) as count, u.id, u.email, u.password, u.profile_pic FROM users u
            LEFT JOIN galaxies g ON u.id = g.user_id
            WHERE u.id = $1
            GROUP BY u.id
            ;
            `,
            [id],
            (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json({
                        user: result.rows[0],
                    });
                }
            }
        );
    },
    myPosts: (req, res) => {
        const id = req.body.id;
        db.query(
            `SELECT g.id, g.user_id, g.text, g.image, g.createdAt, u.name
            FROM galaxies g
            LEFT JOIN users u ON u.id = g.user_id
            WHERE u.id = $1
            ORDER BY createdAt DESC
            ;`,
            [id],
            (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json(result.rows);
                }
            }
        );
    },
    addFavorites: (req, res) => {
        const { favorited_by, star_id } = req.body;
        db.query(
            `
            INSERT INTO favorites (favorited_by, star_id)
            VALUES ($1, $2)
            RETURNING id, favorited_by, star_id;
            `,
            [favorited_by, star_id],
            (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json({
                        message: `Star added to your favorites!`,
                    });
                }
            }
        );
    },
    getFavorites: (req, res) => {
        const { id } = req.body;
        console.log(req.body);
        db.query(
            `
            SELECT f.favorited_by AS favorited_by_id,
                v.name AS favorited_by_name,
                u.id AS author_id,
                u.name AS author_name,
                g.id AS star_id,
                g.text,
                g.createdAt AS created,
                g.image
            FROM favorites f
            LEFT JOIN galaxies g ON g.id = f.star_id
            LEFT JOIN users u ON u.id = g.user_id
            LEFT JOIN users v ON v.id = f.favorited_by
            WHERE f.favorited_by = $1;
            `,
            [id],
            (error, result) => {
                console.log(result);
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json(result.rows);
                }
            }
        );
    },
};

module.exports = user;
