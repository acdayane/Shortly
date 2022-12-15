import bcrypt from "bcrypt";
import { userSchema } from "../schemas/schemas.js";

export async function signUp (req, res) {
    const {name, email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        return res.sendStatus(422);
    };

    const validation = userSchema.validate({ name, email, password }, { abortEarly: false });
    if (validation.error) {
        const err = validation.error.details.map((d) => d.message);
        return res.status(422).send(err);
    };

    const passwordHash = bcrypt.hashSync(password, 2);

    try {
        const checkEmail = await connectionDB.query('SELECT * FROM users WHERE email = $1;', [email]);
        if (checkEmail.rows.length !== 0) {
            return res.sendStatus(409);
        };

        await connectionDB.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, passwordHash]);

        res.sendStatus(201);

    } catch (err) {
        res.status(422).send(err);
    };
};

export async function signIn (req, res) {

};