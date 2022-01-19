const db = require("../database");
const fs = require("fs");

const galaxy = {
    getAll: (req, res) => {
        db.query(
            `SELECT g.id, g.user_id, g.text, g.image, g.createdAt, u.name
            FROM galaxies g
            LEFT JOIN users u ON u.id = g.user_id
            ORDER BY createdAt DESC;`,

            (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                }

                if (!result.rowCount) {
                    res.json({ message: "No entries found" });
                } else {
                    res.json(result.rows);
                }
            }
        );
    },
    delete: (req, res) => {
        db.query(
            `
            DELETE FROM galaxies
            WHERE id=$1;
            `,
            [req.body.id],
            (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json({ message: "Star deleted!" });
                }
            }
        );
    },
    submit: (req, res) => {
        if (!req.body.text) {
            res.status(400).json({
                error: "You need to add some text to your galaxy!",
            });
        } else {
            const userId = req.body.userid;
            const text = req.body.text;
            const image = req.files.file.size
                ? fs.readFileSync(req.files.file.path).toString("base64")
                : "";

            db.query(
                `
            INSERT INTO galaxies (user_id, text, image, createdAt, updatedAt)
            VALUES ($1, $2, $3, now(), now())
            RETURNING *;
            `,
                [userId, text, image],
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: error,
                        });
                    } else {
                        console.log(result.rows[0]);
                        res.json(result.rows[0]);
                    }
                }
            );
        }
    },
};

module.exports = galaxy;
