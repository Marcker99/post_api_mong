

import {body} from "express-validator";
import {ObjectId} from "mongodb";
import {UserService} from "../../../domain/users_service";

export const checkLogin = body('login')
    .exists()
    .withMessage({
        message: "incorrect login",
        field: "login"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect login",
        field: "login"
    })
    .bail()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage({
        message: "incorrect login",
        field: "login"
    })
    .bail()
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage({
        message: "incorrect login",
        field: "login"
    })


export const checkPass = body('password')
    .exists()
    .withMessage({
        message: "incorrect password",
        field: "password"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect password",
        field: "password"
    })
    .bail()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage({
        message: "incorrect password",
        field: "password"
    })

export const checkEmail = body('email')
    .exists()
    .withMessage({
        message: "incorrect email",
        field: "email"
    })
    .bail()
    .isString()
    .withMessage({
        message: "incorrect email",
        field: "login"
    })
    .bail()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage({
        message: "incorrect email",
        field: "email"
    })

export const checkConfirmCode = body('code')
    .exists()
    .withMessage({
        message: "code is required.",
        field: "code"
    })
    .bail()
    .isString()
    .withMessage({
        message:"Code must be a string.",

    })
    .bail()
    .trim()
    .isLength({ min: 10,max: 60})
    .withMessage({
        message: "incorrect code",
    })
    .bail()
    .custom(async (value, { req }) => {
        const currentCode = await UserService.checkUsersDataBeforeConfirmation(value)
        if (!currentCode) {
            throw new Error();
        }
        return true;
    })
    .withMessage({
        message: "incorrect code",
    })

export const emailConfirmation = body('email')
.custom(async (value, {req:Request}) =>{
    const confirming = await UserService.checkEmailConfirmation(value)
    if(!confirming){
        throw new Error();
    }
    return true
})
.withMessage({
    message: "email was confirmed"
})

export const checkEmailExistingBeforeReg = body('email')
.custom(async (value,{req:Request}) =>{
    const existEmail = await UserService.checkUsersDataExisting(value)
    if(existEmail){
        throw new Error();
    }
    return true
})
.withMessage({
    message: "it email is exists"
})

export const checkLoginExistingBeforeReg = body('login')
    .custom(async (value,{req:Request}) =>{
        const existEmail = await UserService.checkUsersDataExisting(value)
        if(existEmail){
            throw new Error();
        }
        return true
    })
    .withMessage({
        message: "it login is exists"
    })