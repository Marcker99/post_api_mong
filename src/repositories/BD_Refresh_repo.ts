import {RefreshTDbType} from "./dbTypes/dbRefreshToken";
import {tokenCollection} from "./db";
import {ObjectId} from "mongodb";

export const refreshRepo = {
    async createNewToken(token:RefreshTDbType){
        return await  tokenCollection.insertOne(token)
        },
    async deactivateToken(idToken:ObjectId){
         const res = await tokenCollection.updateOne({_id: idToken},{$set: {isValid: false}})
        return res
    },

    async getTokenByToken(token:string): Promise<RefreshTDbType | null>{
        const result: RefreshTDbType | null = await tokenCollection.findOne({'subject.token': token})
        return result
    },
    async clearAll(){
        return tokenCollection.deleteMany({})
    }
    }
