import {Router,Request,Response} from "express";
import {checkLoginOrEmail, checkPassword} from "./middleWares/validators/LogAuth_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";

export const authLogRouters = Router({})

authLogRouters.post('/login',checkLoginOrEmail,checkPassword,errorsMiddleware,(req:Request,res:Response) =>{
    const result = UserService.checkCredentials(req.body.loginOrEmail,req.body.password)
    if(!result){
        res.sendStatus(401)
        return
    } else {
        res.sendStatus(204)
        return; //?
    }
})