import {body, check} from "express-validator";
import {UserService} from "../../../domain/users_service";

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
    .bail()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage({
        message: "incorrect password",
        field: "password"
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
