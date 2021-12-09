const db = require("../database");

const galaxy = {
    getAll: (req, res) => {
        db.query(
            `select * from galaxies where private = false;`,
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
        //  <form action="" method="post" enctype="multipart/form-data"></form> // front-end
        if (!req.body.text) {
            res.status(400).json({
                error: "You need to add some text to your galaxy!",
            });
        } else {
            db.query(
                `
            INSERT INTO galaxies (text, image)
            VALUES ($1, $2)
            RETURNING id;
            `,
                [req.body.text, req.body.image],
                (error, result) => {
                    if (error) {
                        res.status(500).json({
                            error: error,
                        });
                    } else {
                        res.json({
                            message: "Galaxy created!",
                        });
                    }
                }
            );
        }
    },
};

module.exports = galaxy;
