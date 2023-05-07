import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export const jwtService = {
    async createJWT(user: UsersDbType){

        const token = jwt.sign({userId: user._id},settings.JWT_SECRET,{expiresIn: '10m'})
        return {
            accessToken: token
        }
    },
    async getUsersIdByToken(token: string){
       try{
           const result: any = jwt.verify(token,settings.JWT_SECRET)  // result = {userId: user._id}
           return new ObjectId(result.userId) // <-!!!
       } catch (error){
           return null
       }
    }
}