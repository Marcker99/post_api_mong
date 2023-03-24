import {Request, Response, Router} from "express";
import {postDataRepositories} from "../repositoriesDataLayer/DB_POSTrepo";
import {blogDataRepositories} from "../repositoriesDataLayer/DB_BLOGrepo";

export const clearRout = Router({})

clearRout.delete('/all-data',async (req: Request, res: Response) => {
    await blogDataRepositories.clearAll()
    await postDataRepositories.clearAll()
    res.sendStatus(204)
})


