import {jwtService} from "../../application/jwt_service";
import {UserService} from "../../domain/users_service";
import {NextFunction,Request,Response} from "express";
import {tokenBLCollection, tokenCollection} from "../../repositories/db";


export const checkRefreshToken = async (req:Request,res:Response,next:NextFunction) =>{
    const refresh = req.cookies.refreshToken
    if(!refresh){
        res.sendStatus(401)
        return
    }
    const isBlocked = await tokenBLCollection.findOne({token:refresh})

    if(isBlocked){
        res.sendStatus(401)
        return
    }
    const userId = await jwtService.getUsersIdByRefreshToken(refresh)

    if(userId){
        req.user = await UserService.getUserById(userId)
        return next()
    }
    else { return res.sendStatus(401)}

}
