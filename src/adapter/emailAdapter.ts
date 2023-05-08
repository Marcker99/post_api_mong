import nodemailer from "nodemailer";
import {settings} from "../settings";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export const EmailAdapter = {
    async sendConfirmCode(userData:UsersDbType){
        let confCode = userData.emailConfirmation.confirmationCode
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.SENDER_ADRESS,
                pass: settings.SENDER_PASS
            }
        });


        let message = {
            from: 'Andrew<settings.SENDER_ADRESS>',
            to: userData.accountData.email,//user email
            subject: 'confirmation',
            html: ` <h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below :
                <a href=https://somesite.com/confirm-email?code=${confCode}>complete registration</a>\n
                </p>`
        }

        return transporter.sendMail(message)

    }



}
