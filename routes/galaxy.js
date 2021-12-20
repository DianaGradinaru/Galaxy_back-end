const db = require("../database");
const fs = require("fs");

const galaxy = {
    getAll: (req, res) => {
        db.query(
            `select * from galaxies where private = false ORDER BY createdAt DESC;`,
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
    submit: (req, res) => {
        if (!req.body.text) {
            res.status(400).json({
                error: "You need to add some text to your galaxy!",
            });
        } else {
            const text = req.body.text;
            const image = req.files.file.size
                ? fs.readFileSync(req.files.file.path).toString("base64")
                : "";

            db.query(
                `
            INSERT INTO galaxies (text, image, createdAt, updatedAt)
            VALUES ($1, $2, now(), now())
            RETURNING *;
            `,
                [text, image],
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
