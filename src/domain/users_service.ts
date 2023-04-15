import {ObjectId, WithId} from "mongodb";
import {UsersDbType, UsersViewType} from "../repositories/db";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import bcrypt from "bcrypt"


export const UserService = {
//delete
    async removeUserById(id: string ):Promise<boolean> {
        const result = await userDataRepositories.removeUserById(id)
        return result
    },
//create
    async createNewUser(login:string,password:string,email:string):Promise<UsersViewType >{

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
            return false
        }
        const userHash = await this._generateHash(password,user.salt)
        if (userHash !== user.hash){
            return false
        } else {
            return true
        }
    },
    async _generateHash(pass:string,salt:string){
        const result =  bcrypt.hash(pass,salt)
        return result
    }

}
