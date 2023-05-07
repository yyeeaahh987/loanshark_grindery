import express, { Application, Request, Response } from "express"
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from "body-parser";
import workflowRouter from './router/workflowRouter';


const app: Application = express()
const port: number = 8080
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


if(process.env.DATABASE_URL){
    // mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    console.log(process.env.DATABASE_URL)
    mongoose.connect(`mongodb://localhost:27017/loanshark`)
    const db = mongoose.connection  
    // console.log(db)
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
 res.send("Hello toto")
})

app.use('/workflow', workflowRouter);


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})