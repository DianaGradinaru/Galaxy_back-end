const db = require("../database");
const fs = require("fs");

const user_info = {
    getData: (req, res) => {
        const id = req.body.id;
        db.query(
            `
            SELECT id, email, password, profile_pic FROM users
            WHERE id = $1;
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
        console.log(res);
    },
};

module.exports = user_info;
