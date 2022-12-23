import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connection } from "../database/database.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    let userId;
    let userName;

    try {
        if (!token) {
            return res.sendStatus(401);
        };

        jwt.verify(token, process.env.SECRET_JWT, (error, decoded) => {

            userId = decoded.id;

            if (error) {
                return res.status(401).send({ message: "invalid token" });
            };

        });

        const userExist = await connection.query('SELECT * FROM users WHERE id = $1;', [userId]);

        userName = userExist.rows[0].name;

        if (userExist.rows.length === 0) {
            return res.sendStatus(409);
        };

        req.userData = { userId, userName };

        next();

    } catch (err) {
        res.status(500).send(err);
    };
};