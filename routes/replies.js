const db = require("../database");

const replies = {
    addReply: (req, res) => {
        const star_id = req.body.star_id;
        const reply_user_id = req.body.reply_user_id;
        const reply_user_name = req.body.reply_user_name;
        const reply_text = req.body.reply_text;

        db.query(
            `
            INSERT INTO replies (star_id, reply_user_id, reply_user_name, reply_text, createdat)
            VALUES ($1, $2, $3, $4, now())
            RETURNING *;
            `,
            [star_id, reply_user_id, reply_user_name, reply_text],
            (error, result) => {
                if (error) {
                    res.status(500).json({ error: error });
                } else {
                    res.json(result.rows[0]);
                }
            }
        );
    },
};
module.exports = replies;
