
import {settings} from "../settings";
import {EmailAdapter, SendCodeBody} from "../adapter/emailAdapter";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export const EmailManager = {
    async userConfirmingMail(email:string,code:string){
        const userData: SendCodeBody = {
            email,
            title: "registration",
            redirectUrl: `https://some-front.com/confirm-registration?code=${code}`
        }
        const info = await EmailAdapter.sendCode(userData)
        return info
    },

}