const db = require("../database");
const fs = require("fs");

const user_info = {
    getData: (req, res) => {
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
        console.log(res);
    },
};

module.exports = user_info;
