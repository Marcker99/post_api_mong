import {Router,Request,Response} from "express";
import {authMiddleWare} from "./middleWares/auth.middleware";
import {isIdValid} from "./middleWares/check_valid_id";
import {checkEmail, checkLogin, checkPass} from "./middleWares/validators/Users_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";
import {usersQueryCollection} from "../query/Users_query_repo";


export const usersRouter = Router({})
    usersRouter.get('/',authMiddleWare,async (req:Request,res:Response) =>{
        const users = await usersQueryCollection.showAllUsers(
            req.query.pageNumber as string,
            req.query.pageSize as string,
            req.query.searchLogin as string,
            req.query.searchEmail as string,
            req.query.sortBy as string,
            req.query.sortDirection as string
        )
        res.send(users)
    });

    usersRouter.post('/',authMiddleWare,
        checkLogin,
        checkPass,
        checkEmail,
        errorsMiddleware,async (req:Request,res:Response) =>{
           const createdUser = await UserService.createNewUser(req.body.login, req.body.password,req.body.email)
            res.status(201).send(createdUser)
        });

    usersRouter.delete('/:id',authMiddleWare,isIdValid,async (req:Request,res:Response) =>{
        const result = await UserService.removeUserById(req.params.id.toString()) //toString?
        result ? res.sendStatus(204) : res.sendStatus(404)
    });


