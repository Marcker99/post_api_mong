import {UserMeViewType, UsersDbType, UsersViewType} from "../repositories/db";

declare global {
    declare namespace Express {
        export interface Request {
            user:UsersDbType | null
        }
    }
}