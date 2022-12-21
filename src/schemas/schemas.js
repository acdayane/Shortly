import joi from "joi";

export const newUserSchema = joi.object({
    name: joi.string().min(3).max(40).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(8).required()
});