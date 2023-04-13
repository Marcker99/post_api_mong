import {ObjectId} from "mongodb";
import {BlogDbType, blogsCollection} from "../../repositories/db";
import {NextFunction,Request,Response} from "express";

export const isIdValid = async (req:Request,res:Response,next:NextFunction)=>{
        const isIdValid = ObjectId.isValid(req.params.id)
        if(!isIdValid) {
            res.sendStatus(404)
        return
    } else {
            next()
        }
}