import {RefreshTDbType} from "./dbTypes/dbRefreshToken";
import {tokenBLCollection, tokenCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlacklistRefToken} from "./dbTypes/blackLystRefToken";

export const refreshRepo = {
    async createNewToken(token:RefreshTDbType){
        return await  tokenCollection.insertOne(token)
        },
    async deactivateToken(token:string){
         return tokenBLCollection.insertOne({token:token})
    },

    async getTokenByToken(token:string): Promise<RefreshTDbType | null>{
        const result: RefreshTDbType | null = await tokenCollection.findOne({'subject.token': token})
        return result
    },
    async clearAll(){
        return tokenCollection.deleteMany({})
    }
    }
