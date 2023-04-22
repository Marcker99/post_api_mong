import {ObjectId, WithId} from "mongodb";
import {UserMeViewType, UsersDbType, UsersViewType} from "../repositories/db";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import bcrypt from "bcrypt"


export const UserService = {
//delete
    async removeUserById(id: string ):Promise<boolean> {
        const result = await userDataRepositories.removeUserById(id)
        return result
    },
//create
    async createNewUser(login:string,password:string,email:string):Promise<UsersViewType>{

        const genSalt = await bcrypt.genSalt(10)
        const usersHash = await this._generateHash(password,genSalt)
        const newUser:WithId<UsersDbType> = {
            _id: new ObjectId(),
            login: login,
            email: email,
            salt: genSalt,
            hash: usersHash,
            createdAt: new Date().toISOString()
        }
        const createdUser = await userDataRepositories.createNewUser(newUser)
        return  createdUser
    },
    async checkCredentials(logEmail:string,password:string){
        const user = await userDataRepositories.checkUsersAuthLogData(logEmail)
        if(!user){
            return null
        }
        const userHash = await this._generateHash(password,user.salt)
        if (userHash !== user.hash){
            return null
        } else {
            return user
        }
    },
    async _generateHash(pass:string,salt:string){
        const result =  bcrypt.hash(pass,salt)
        return result
    },
    async getUserById(userId:ObjectId):Promise<UsersDbType | null>{
        return await userDataRepositories.getById(userId)
    }



}
