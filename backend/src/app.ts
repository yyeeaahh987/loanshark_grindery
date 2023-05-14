import express, { Application, Request, Response } from "express"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from "body-parser";
import workflowRouter from './router/workflowRouter';
import emailRouter from './router/emailRouter';
import discordRouter from './router/discordRouter';


const app: Application = express()
const port: number = 8080
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


if (process.env.DATABASE_URL) {
    console.log(`${process.env.DATABASE_URL}`)
    mongoose.connect(`${process.env.DATABASE_URL}`)
    const db = mongoose.connection
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
    res.send("Hello toto")
})

app.use('/email', emailRouter);
app.use('/discord', discordRouter);
app.use('/workflow', workflowRouter);


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})





// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const { authenticate } = require('@google-cloud/local-auth');
// const { google } = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//     try {
//         const content = await fs.readFile(TOKEN_PATH);
//         const credentials = JSON.parse(content);
//         return google.auth.fromJSON(credentials);
//     } catch (err) {
//         return null;
//     }
// }

// /**
//  * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client:any) {
//     const content = await fs.readFile(CREDENTIALS_PATH);
//     const keys = JSON.parse(content);
//     const key = keys.installed || keys.web;
//     const payload = JSON.stringify({
//         type: 'authorized_user',
//         client_id: key.client_id,
//         client_secret: key.client_secret,
//         refresh_token: client.credentials.refresh_token,
//     });
//     await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//     let client = await loadSavedCredentialsIfExist();
//     if (client) {
//         return client;
//     }
//     client = await authenticate({
//         scopes: SCOPES,
//         keyfilePath: CREDENTIALS_PATH,
//     });
//     if (client.credentials) {
//         await saveCredentials(client);
//     }
//     return client;
// }

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// async function listLabels(auth:any) {
//     const gmail = google.gmail({ version: 'v1', auth });
//     const res = await gmail.users.labels.list({
//         userId: 'me',
//     });
//     const labels = res.data.labels;
//     if (!labels || labels.length === 0) {
//         console.log('No labels found.');
//         return;
//     }
//     console.log('Labels:');
//     labels.forEach((label:any) => {
//         console.log(`- ${label.name}`);
//     });
// }

// authorize().then(listLabels).catch(console.error);