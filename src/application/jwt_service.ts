import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";
import {refreshRepo} from "../repositories/BD_Refresh_repo";
import {RefreshTDbType} from "../repositories/dbTypes/dbRefreshToken";
export type Tokens = {
    accsess: {
        accessToken: string;
    }
    refresh:string;
} //?

export const jwtService = {
    async createJWT(user: UsersDbType){

        const token = jwt.sign({userId: user._id},settings.JWT_SECRET,{expiresIn: '10s'})
        return {
            accessToken: token
        }
    },
    async createRefreshJwt(user: UsersDbType){
        const refreshToken = jwt.sign({userId: user._id},settings.REF_SECRET,{expiresIn: '20s'})
        const newToken: WithId<RefreshTDbType> = {
            _id: new ObjectId(),
            subject:{
                userId: user._id,
                token: refreshToken,
            },
            isValid:true
        }
        await refreshRepo.createNewToken(newToken) //try catch
        return refreshToken
    },
    async getUsersIdByToken(token: string){
       try{
           const result: any = jwt.verify(token,settings.JWT_SECRET)  // result = {userId: user._id}
           return new ObjectId(result.userId) // <-!!!
       } catch (error){
           return null
       }
    },

        async getUsersIdByRefreshToken(token: string){
       try{
           const result: any = jwt.verify(token,settings.REF_SECRET)
           return new ObjectId(result.userId)
       } catch (error){
           return null
       }
    },

    async getNewTokens(user:UsersDbType,token:string):Promise<Tokens | null> {
       const refTokenData: RefreshTDbType | null = await refreshRepo.getTokenByToken(token)//todo по токену
        console.log(refTokenData)
       if(!refTokenData){
           return null
       }
       if(!refTokenData.isValid){
           return null
       }
       const deactivate = this.deactivateRefreshToken(refTokenData._id)
       if(!deactivate){
           return null
       }

        const accsess = await this.createJWT(user)
        const refresh = await this.createRefreshJwt(user)

       const result: Tokens = {
           accsess,
           refresh,
        }
       return result

    },
    async deactivateRefreshToken(id:ObjectId){
        const result = await refreshRepo.deactivateToken(id)
        return result
    }


}

