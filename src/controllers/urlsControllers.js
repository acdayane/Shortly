import { connection } from "../database/database.js";
import { urlSchema } from "../schemas/schemas.js";
import { nanoid } from "nanoid";

export async function newShortUrl(req, res) {
    const { userId } = req.userData;
    const { url } = req.body;
    const shortUrl = nanoid();    
   
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
        const urlExist = await connection.query(`
            SELECT id, url, "shortUrl" FROM urls WHERE id=$1;`, [urlId]
        );
        if (urlExist.rows.length === 0) {
            return res.sendStatus(404);
        };

        res.status(200).send(urlExist.rows[0]);

    } catch (err) {
        res.status(500).send(err);
    };
};

export async function visitUrl(req, res) {
    const shortUrl = req.params.shortUrl;

    try {
        const urlExist = await connection.query(`
            SELECT id, url, "visitCount" FROM urls WHERE "shortUrl" = $1`, [shortUrl]
        );
        const count = urlExist.rows[0].visitCount + 1;
        const id = urlExist.rows[0].id;
        const url = urlExist.rows[0].url;

        if (urlExist.rows.length === 0) {
            return res.sendStatus(404);
        };

        await connection.query(`
            UPDATE urls SET "visitCount"=$1 WHERE id=$2`, [count, id]
        );

        res.status(200).redirect(url);

    } catch (err) {
        res.status(500).send(err);
    };
};

export async function deleteUrl(req, res) {
    const userId = req.id;
    const urlId = req.params.id;

    try {
        const urlExist = await connection.query(`
            SELECT "userId" FROM urls WHERE id=$1;`, [urlId]
        );

        if (urlExist.rows.length === 0) {
            return res.sendStatus(404);
        };

        if (urlExist.rows[0].userId !== userId) {
            return res.sendStatus(401);
        };

        await connection.query(`
            DELETE FROM urls WHERE id=$1`, [urlId]
        );

        res.sendStatus(204);

    } catch (err) {
        res.sendStatus(500);
    };
};