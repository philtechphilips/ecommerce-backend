import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailConfig } from "../mails/config";
dotenv.config();



const sendMail = async function (subject, html, recepient) {
  const data = {
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_ADDRESS}>`,
    to: recepient,
    subject,
    html,
  };

   const transporter = nodemailer.createTransport(emailConfig)
   transporter.sendMail(data, (err, info) => {
    if (err){
      console.log(err)
    }else {
      return info.response
    }
   })
};

export { sendMail };
