import { connection } from "../database/database.js";

export async function ranking(req, res) {

    try {
        let ranking = await connection.query(`
            SELECT users.id, users.name, COUNT(urls."userId") AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) AS "visitCount"
            FROM users
            LEFT JOIN urls
            ON users.id = urls."userId"
            GROUP BY users.id
            ORDER BY "visitCount" DESC, "linksCount" DESC;`
        );
        ranking = ranking.rows;

        res.status(200).send(ranking);

    } catch (err) {
        res.sendStatus(500);
    };
};
