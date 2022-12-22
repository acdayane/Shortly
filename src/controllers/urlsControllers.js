import { connection } from "../database.js";
import { urlSchema } from "../schemas/schemas.js";
import { nanoid } from "nanoid";

export async function newShortUrl(req, res) {
    const { url } = req.body;
    const shortUrl = nanoid();   
    const userId = req.id;

    try {
        const validation = urlSchema.validate({ url, shortUrl, userId }, { abortEarly: false });
        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            res.status(422).send(err);
        };

        await connection.query(`
            INSERT INTO urls ("userId", "url", "shortUrl")
            VALUES ($1, $2, $3);`,
            [userId, url, shortUrl]
        );

        res.status(201).send({ shortUrl });

    } catch (err) {
        res.status(500).send(err);
    };
};

export async function getUrlById(req, res) {
    const urlId = req.params.id;

    try {
        const urlExist = await connection.query('SELECT id, url, "shortUrl" FROM urls WHERE id=$1;', [urlId]);
        if (urlExist.rows.length === 0) {
            return res.sendStatus(404);
        };

        res.status(200).send(urlExist.rows[0]);

    } catch (err) {
        res.status(500).send(err);
    };
};

export async function visitUrl(req, res) {

};

export async function deleteUrl(req, res) {

};