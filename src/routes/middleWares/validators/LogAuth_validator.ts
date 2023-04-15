import {body, check} from "express-validator";

export const checkLoginOrEmail = body('loginOrEmail')
    .exists()
    .withMessage({
        message: "incorrect login or email",
        field: "loginOrEmail"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect login or email",
        field: "loginOrEmail"
    })


export const checkPassword = body('password')
    .exists()
    .withMessage({
        message: "incorrect pass",
        field: "password"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect pass",
        field: "password"
    })