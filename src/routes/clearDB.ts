import {Request, Response, Router} from "express";
import {postDataRepositories} from "../repositories/DB_POSTrepo";
import {blogDataRepositories} from "../repositories/DB_BLOGrepo";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import {commentDataRepositories} from "../repositories/DB_COMMENTSrepo";

export const clearRout = Router({})

clearRout.delete('/all-data',async (req: Request, res: Response) => {
    await blogDataRepositories.clearAll()
    await postDataRepositories.clearAll()
    await userDataRepositories.clearAll()
    await commentDataRepositories.clearAll()
    res.sendStatus(204)
})


