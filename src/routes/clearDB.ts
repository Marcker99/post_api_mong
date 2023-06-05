import {Request, Response, Router} from "express";
import {postDataRepositories} from "../repositories/DB_POSTrepo";
import {blogDataRepositories} from "../repositories/DB_BLOGrepo";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import {commentDataRepositories} from "../repositories/DB_COMMENTSrepo";
import {refreshRepo} from "../repositories/BD_Refresh_repo";
import {tokenBLCollection} from "../repositories/db";

export const clearRout = Router({})

clearRout.delete('/all-data',async (req: Request, res: Response) => {
    await blogDataRepositories.clearAll()
    await postDataRepositories.clearAll()
    await userDataRepositories.clearAll()
    await commentDataRepositories.clearAll()
    await tokenBLCollection.deleteMany()
    res.sendStatus(204)
})


