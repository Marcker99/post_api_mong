import {NextFunction,Request,Response} from "express";
import {jwtService} from "../../application/jwt_service";
import {UserService} from "../../domain/users_service";

export const authenticationMiddleware = async (req:Request,res:Response,next:NextFunction) =>{
    if(!req.headers.authorization){
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
   console.log(req.headers.authorization)
    const userId = await jwtService.getUsersIdByToken(token)
    if(userId){
        req.user = await UserService.getUserById(userId) //user = whole user obj
        next()
    }
    else {res.sendStatus(401)}
    return
}