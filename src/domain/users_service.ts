import {ObjectId, WithId} from "mongodb";
import {userDataRepositories} from "../repositories/DB-USERSrepo";
import bcrypt from "bcrypt"
import {UsersDbType, UsersViewType} from "../repositories/dbTypes/dbUserType";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"
import {EmailManager} from "../maneger/emailManager";

export const UserService = {
//delete
    async removeUserById(id: string ):Promise<boolean> {
        const result = await userDataRepositories.removeUserById(id)
        return result
    },
//create

    async createNewUser(login:string,password:string,email:string):Promise<UsersViewType | null>{

        const genSalt = await bcrypt.genSalt(10)
        const usersHash = await this._generateHash(password,genSalt)
        const newUser:WithId<UsersDbType> = {
            _id: new ObjectId(),
                accountData: {
                    login: login,
                    email: email,
                    salt: genSalt,
                    hash: usersHash,
                    createdAt: new Date().toISOString()},
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false,
            }
        }
        const createdUser = await userDataRepositories.createNewUser(newUser)
        try{
            await EmailManager.userConfirmedMail(newUser)
        }catch (e) {
            if(!e){
                //await this.removeUserById(createdUser.id)
                return null
            }
        }
        return  createdUser
    },


    async checkCredentials(logEmail:string,password:string){
        const user = await userDataRepositories.checkUsersLoginOrEmailData(logEmail)
        if(!user){
            return null
        }
        if(!user.emailConfirmation.isConfirmed){
            return null
        }

        const userHash = await this._generateHash(password,user.accountData.salt)
        if (userHash !== user.accountData.hash){
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
    },

    async confirmationUser(confirmCode:string):Promise<boolean> {
        const user = await userDataRepositories.findUserByConfirmationCode(confirmCode)
        if(!user){return false}
        if(user.emailConfirmation.confirmationCode !== confirmCode){return false}
        if(user.emailConfirmation.isConfirmed){return false}
        if(user.emailConfirmation.expirationDate < new Date()){
            //await this.removeUserById(user._id.toString())todo
            return false
        }

        const confirmed = await userDataRepositories.userConfirming(user._id)
        if(!confirmed){
            return false
        } else {
            return true
        }

    },


    async resendingEmail(email: string): Promise<boolean>{
        let user = await userDataRepositories.checkUsersEmail(email)
        if(!user){
            return false
        }
        if(user.emailConfirmation.isConfirmed){
            return false
        }
        try{
            await EmailManager.userConfirmedMail(user)
        }catch (e) {
            if(!e){
                //await this.removeUserById(user._id.toString())
                return false
            }
        }
        return  true
    }


}
