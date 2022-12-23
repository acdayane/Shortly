import bcrypt from "bcrypt";
import { newUserSchema } from "../schemas/schemas.js";
import { connection } from "../database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.sendStatus(422);
    };

    const validation = newUserSchema.validate({ name, email, password }, { abortEarly: false });
    if (validation.error) {
        const err = validation.error.details.map((d) => d.message);
        return res.status(422).send(err);
    };

    const passwordHash = bcrypt.hashSync(password, 2);

    try {
        const checkEmail = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if (checkEmail.rows.length !== 0) {
            return res.sendStatus(409);
        };

        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, passwordHash]);

        res.sendStatus(201);

    } catch (err) {
        res.status(422).send(err);
    };
};

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const checkEmail = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if (checkEmail.rows.length === 0) {
            return res.sendStatus(409);
        };

        const checkPassword = bcrypt.compareSync(password, checkEmail.rows[0].password);
        if (!checkPassword) {
            return res.sendStatus(401);
        };

        const userId = checkEmail.rows[0].id;
        const token = jwt.sign({ id: userId }, process.env.SECRET_JWT, { expiresIn: 86400 });

        res.status(200).send({ token });

    } catch (err) {
        res.status(422).send(err);
    };
};

export async function userUrls(req, res) {
    const { userId, userName } = req.userData;
    let arrUrls = [];

    try {

        let sumVisits = await connection.query(`
            SELECT SUM("visitCount") FROM urls WHERE "userId"=$1;`, [userId]
        );
        sumVisits = sumVisits.rows[0].sum;

        const urls = await connection.query(`
            SELECT * FROM urls WHERE "userId"=$1 ORDER BY id;`, [userId]
        );

        for (let i=0; i<urls.rows.length; i++) {
            arrUrls.push({
                id: urls.rows[i].id,
                shortUrl: urls.rows[i].shortUrl,
                url: urls.rows[i].url,
                visitCount: urls.rows[i].visitCount
            });
        };

        const objUserUrls = {
            id: userId,
            name: userName,
            visitCount: sumVisits,
            shortenedUrls: arrUrls
        };

        res.status(200).send(objUserUrls);

    } catch (err) {
        res.status(500).send(err);
    };
};