import {jwtService} from "../../application/jwt_service";
import {UserService} from "../../domain/users_service";
import {NextFunction,Request,Response} from "express";


export const checkRefreshToken = async (req:Request,res:Response,next:NextFunction) =>{
    const refresh = req.cookies.refreshToken
    if(!refresh){
        res.sendStatus(401)
        return
    }
    const userId = await jwtService.getUsersIdByRefreshToken(refresh)

    if(userId){
        req.user = await UserService.getUserById(userId)
        next()
    }
    else {res.sendStatus(401)}
    return
}
