import joi from "joi";

export const userSchema = joi.object({
    name: joi.string().min(5).max(40).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(8).required()
});