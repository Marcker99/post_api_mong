import {Router,Request,Response} from "express";
import {checkLoginOrEmail, checkPassword} from "./middleWares/validators/LogAuth_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";
import {jwtService} from "../application/jwt_service";
import {authenticationMiddleware} from "./middleWares/authentication_middleware";
import {usersQueryCollection} from "../query/Users_query_repo";
import {UsersDbType} from "../repositories/db";

export const authenticationRouters = Router({})

authenticationRouters.post('/login',checkLoginOrEmail,checkPassword,errorsMiddleware,async (req:Request, res:Response) =>{
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(user){
        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
    } else {
        res.sendStatus(401)
    }
})

authenticationRouters.get('/me',authenticationMiddleware,async (req:Request,res:Response)=>{
    const user: UsersDbType | null = req!.user
    const result = await usersQueryCollection.getMe(user)

    res.send(result)

})