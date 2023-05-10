import {Router,Request,Response} from "express";
import {authorizationMiddleware} from "./middleWares/authorization.middleware";
import {isIdValid} from "./middleWares/check_valid_id";
import {checkEmail, checkLogin, checkPass} from "./middleWares/validators/Users_validator";
import {errorsMiddleware} from "./middleWares/errors_Middleware";
import {UserService} from "../domain/users_service";
import {usersQueryCollection} from "../query/Users_query_repo";


export const usersRouter = Router({})
    usersRouter.get('/',authorizationMiddleware,async (req:Request, res:Response) =>{
        const users = await usersQueryCollection.showAllUsers(
            req.query.pageNumber as string,
            req.query.pageSize as string,
            req.query.searchLoginTerm as string,
            req.query.searchEmailTerm as string,
            req.query.sortBy as string,
            req.query.sortDirection as string
        )
        res.send(users)
    });

    usersRouter.post('/',authorizationMiddleware,
        checkLogin,
        checkPass,
        checkEmail,
        errorsMiddleware,async (req:Request,res:Response) =>{
           const createdUser = await UserService.createUserByAdmin(req.body.login, req.body.password,req.body.email)
            //queryRepo.getUserById(createdUserId)
            res.status(201).send(createdUser)
        });

    usersRouter.delete('/:id',authorizationMiddleware,isIdValid,async (req:Request, res:Response) =>{
        const result = await UserService.removeUserById(req.params.id.toString()) //toString?
        result ? res.sendStatus(204) : res.sendStatus(404)
    });


