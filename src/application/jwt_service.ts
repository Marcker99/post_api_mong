import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";
import {refreshRepo} from "../repositories/BD_Refresh_repo";
import {RefreshTDbType} from "../repositories/dbTypes/dbRefreshToken";

export type Tokens = {
    accessToken: string;
    refreshToken: string

} //?

export const jwtService = {
    async createJWT(user: UsersDbType) {

       return  jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10s'})
    },
    async createRefreshJwt(user: UsersDbType) {
        return jwt.sign({userId: user._id}, settings.REF_SECRET, {expiresIn: '20s'})
    },
    async getUsersIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)  // result = {userId: user._id}
            return new ObjectId(result.userId) // <-!!!
        } catch (error) {
            return null
        }
    },

    async getUsersIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.REF_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async getNewTokens(user: UsersDbType, token: string): Promise<Tokens> {
        await this.deactivateRefreshToken(token)
        const accessToken = await this.createJWT(user)
        const refreshToken = await this.createRefreshJwt(user)

        return {
            accessToken,
            refreshToken
        }

    },
    async deactivateRefreshToken(token: string) {
       return  refreshRepo.deactivateToken(token)
    }


}

