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
        console.log(req.body, req.files);
    },
};

module.exports = galaxy;
