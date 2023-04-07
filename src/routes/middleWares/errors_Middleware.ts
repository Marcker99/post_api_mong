import {NextFunction,Request,Response} from 'express'
import {validationResult} from "express-validator";

export const errorsMiddleware = (req:Request,res: Response, next:NextFunction)=>{
    const errors = validationResult(req) //<-!!!

    if(!errors.isEmpty()) {
        const errArr = errors.array()
        const resError = errArr.map((error) => ({                                                   //arr[{}]
            ...error.msg,
        }));
                                                                                       //const resError = errArr[0].msg
        const errorsMessages = [...resError]

        res.status(400).send({errorsMessages})
    } else {
        next()
    }

}
