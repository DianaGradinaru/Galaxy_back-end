const db = require("../database");
const mime = require("mime-types")

const fs = require("fs");
const util = require("util");
const deleteFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, deleteObject, getFile } = require("../s3");

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
    getImage: async (req, res) => {
        const key = req.params.key;
        console.log("req.params.key");
        console.log(req.params.key);

        // const readStream = getFileStream(key);
        // readStream.pipe(res);
        res.json({ key });
    },
    delete: async (req, res) => {
        const key = req.body.image;
        // console.log("req body image");
        // console.log(req.body.image);
        // await deleteObject(key);

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
    submit: async (req, res) => {
        if (!req.body.text) {
            res.status(400).json({
                error: "You need to add some text to your galaxy!",
            });
        } else {
            const userId = req.body.userid;
            const text = req.body.text;
            const image = req.file;
            console.log("req.file");
            console.log(req.file);

            let query;
            let options;
            if (req.file != null) {
                const result = await uploadFile(image);

                await deleteFile(req.file.path);
                query = `
                INSERT INTO galaxies (user_id, text, image, createdAt, updatedAt)
                VALUES ($1, $2, $3, now(), now())
                RETURNING *;
                `;
                options = [userId, text, image.filename + "." + mime.extension(image.mimetype)];
            } else {
                query = `
                INSERT INTO galaxies (user_id, text, createdAt, updatedAt)
                VALUES ($1, $2, now(), now())
                RETURNING *;
                `;
                options = [userId, text];
            }
            db.query(query, options, (error, result) => {
                if (error) {
                    res.status(500).json({
                        error: error,
                    });
                } else {
                    res.json(result.rows[0]);
                }
            });
        }
    },
};

module.exports = galaxy;
