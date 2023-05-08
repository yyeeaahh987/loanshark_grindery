import nodemailer from "nodemailer";

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL
const GOOGLE_PASS = process.env.GOOGLE_PASS
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: GOOGLE_EMAIL,
        pass: GOOGLE_PASS,
    },
});

const HTML_TEMPLATE = (text: any) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>EMAIL HEADER</h1>
              </div>
              <div class="email-body">
                <p>hi</p>
              </div>
              <div class="email-footer">
                <p>EMAIL FOOTER</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
}

const triggerSendEmail = async (mailDetails: any, callback: any) => {
    try {
        const info = await transporter.sendMail(mailDetails)
        callback(info);
    } catch (error) {
        console.log(error);
    }
};

const message = "Hi there, you were emailed me through nodemailer"


export async function sendEmail(toList:string,ccList:string){
    const options = {
        from: "TESTING <sender@gmail.com>", // sender address
        to: toList, //"tyehcwc402004@gmail.com;tyehcwc12@gmail.com", // receiver email
        cc: ccList,
        subject: "Send email in Node.JS with Nodemailer using Gmail account", // Subject line
        text: message,
        html: HTML_TEMPLATE(message),
    }
    
    try{
        const result = await triggerSendEmail(options,(info:any)=>{
            console.log("Email sent successfully");
            console.log("MESSAGE ID: ", info.messageId);
        })
        console.log(`result: `,result)
    }catch(e){
        console.log(e)
    }
    return 
}