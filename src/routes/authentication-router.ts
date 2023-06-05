import {Router,Request,Response} from "express";
import {checkLoginOrEmail, checkPassword,checkConfirmCode,checkEmailExistingBeforeReg,checkLoginExistingBeforeReg,
    emailConfirmation} from "./middleWares/validators/LogAuth_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";
import {jwtService, Tokens} from "../application/jwt_service";
import {authenticationMiddleware} from "./middleWares/authentication_middleware";
import {usersQueryCollection} from "../query/Users_query_repo";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";
import {
    checkEmail,
    checkLogin,
    checkPass,
} from "./middleWares/validators/Users_validator";
import {checkRefreshToken} from "./middleWares/chekRefreshToken";


export const authenticationRouter = Router({})

authenticationRouter.post('/login',checkLoginOrEmail,checkPassword,errorsMiddleware,
    async (req:Request, res:Response) =>{
    const user = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(user){
        const token = await jwtService.createJWT(user)
        const refToken = await jwtService.createRefreshJwt(user)
        res.cookie('refreshToken',refToken.refreshToken,{secure: true,httpOnly: true})
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



authenticationRouter.post('/refresh-token',checkRefreshToken, async (req:Request, res:Response)=>{

    const user: UsersDbType = req!.user
    const refToken = req.cookies.refreshToken
    const result: Tokens | null = await jwtService.getNewTokens(user,refToken)
    if(!result?.refresh || !result.accsess){
        return res.sendStatus(401)
    }

    res.cookie('refreshToken',result?.refresh.refreshToken,{secure: true,httpOnly: true})
    return res.send(result?.accsess.accessToken)

})



authenticationRouter.post('/logout',checkRefreshToken, async (req:Request, res:Response)=>{
    const refresh_token = req.cookies.refreshToken
    const result = await jwtService.deactivateRefreshToken(refresh_token)
    res.clearCookie('refreshToken').sendStatus(204)
})

authenticationRouter.post('/registration',checkLogin, checkPass,
    checkEmail,checkEmailExistingBeforeReg,checkLoginExistingBeforeReg, errorsMiddleware, async (req:Request, res:Response) =>{
        const user = await UserService.createNewUser(req.body.login,req.body.password,req.body.email)
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