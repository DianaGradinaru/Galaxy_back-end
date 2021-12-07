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
};

module.exports = galaxy;
