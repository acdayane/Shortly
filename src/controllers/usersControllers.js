import bcrypt from "bcrypt";
import {v4 as uuidV4} from "uuid";
import { newUserSchema } from "../schemas/schemas.js";
import { connection } from "../database.js";

export async function signUp (req, res) {
    const {name, email, password, confirmPassword} = req.body;
    console.log('oi')

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

export async function signIn (req, res) {
    const {email, password} = req.body;
    const token = uuidV4;

    try {
        const checkEmail = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        if (checkEmail.rows.length !== 0) {
            return res.sendStatus(409);
        };
        const userId = checkEmail.rows.id;
        console.log(userId)

        const checkPassword = bcrypt.compareSync(password, checkEmail.rows.password);
        if (!checkPassword) {
            return res.sendStatus(401);
        };

        const openedSession = await connection.query('SELECT * FROM sessions WHERE "userId" = $1;', [userId]);
        if (openedSession) {
            await connection.query('DELETE.....');
        };

        await connection.query('INSERT INTO sessions (name, email, password) VALUES ($1, $2, $3);', [token]);

        res.sendStatus(201);

    } catch (err) {
        res.status(422).send(err);
    };
};