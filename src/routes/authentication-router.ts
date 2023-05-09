import {Router,Request,Response} from "express";
import {checkLoginOrEmail, checkPassword} from "./middleWares/validators/LogAuth_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";
import {jwtService} from "../application/jwt_service";
import {authenticationMiddleware} from "./middleWares/authentication_middleware";
import {usersQueryCollection} from "../query/Users_query_repo";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";
import {
    checkConfirmCode,
    checkEmail, checkEmailExistingBeforeReg,
    checkLogin, checkLoginExistingBeforeReg,
    checkPass,
    emailConfirmation
} from "./middleWares/validators/Users_validator";


export const authenticationRouter = Router({})

authenticationRouter.post('/login',checkLoginOrEmail,checkPassword,errorsMiddleware,
    async (req:Request, res:Response) =>{
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(user){
        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
    } else {
        res.sendStatus(401)
    }
})

authenticationRouter.get('/me',authenticationMiddleware,async (req:Request, res:Response)=>{
    const user: UsersDbType | null = req!.user
    const result = await usersQueryCollection.getMe(user)

    res.send(result)

})


authenticationRouter.post('/registration',checkLogin, checkPass,
    checkEmail,checkEmailExistingBeforeReg,checkLoginExistingBeforeReg, errorsMiddleware, async (req:Request, res:Response) =>{
        const user = await UserService.createNewUser(req.body.login, req.body.password,req.body.email)
        if(!user){
            res.send(400)
        } else {
            res.send(204)
        }


    })

authenticationRouter.post('/registration-confirmation',checkConfirmCode,errorsMiddleware,
    async (req:Request,res:Response) =>{
     let confirmation = await UserService.confirmationUser(req.body.code)
    if(!confirmation){res.send(400)
    } else {res.send(204)}
})

authenticationRouter.post('/registration-email-resending',checkEmail,emailConfirmation, errorsMiddleware,
    async (req:Request, res:Response)=> {
       let resent = await UserService.resendingEmail(req.body.email)
       if(!resent){
           res.send(400)
       }
       else {
           res.send(204)
       }
    })