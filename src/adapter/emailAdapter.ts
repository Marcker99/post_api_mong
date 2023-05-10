import nodemailer from "nodemailer";
import {settings} from "../settings";
import {UsersDbType} from "../repositories/dbTypes/dbUserType";

export type SendCodeBody ={
    email:string,

    title: string,
    redirectUrl: string
}

export const EmailAdapter = {
    async sendCode({email,title,redirectUrl}:SendCodeBody){

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.SENDER_ADRESS,
                pass: settings.SENDER_PASS
            }
        });


        let message = {
            from: 'Andrew<settings.SENDER_ADRESS>',
            to: email,
            subject: title,
            html: `<h1>Thank you for your ${title}</h1>
         <p>To finish ${title}, please follow the link below:</p>
         <a href='${redirectUrl}'>Complete registration</a>`
        };

        return transporter.sendMail(message) //true



    },





}
