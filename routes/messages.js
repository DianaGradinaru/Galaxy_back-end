const db = require("../database");

const messages = {
    addMessage: (req, res) => {
        const author = req.body.author;
        const user_id = req.body.user_id;
        const room = req.body.room;
        const message = req.body.message;
        db.query(
            `
            INSERT INTO messaging (author, user_id, room, message, time)
            VALUES ($1, $2, $3, $4, now())
            RETURNING *;
            `,
            [author, user_id, room, message],
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
module.exports = messages;
