import express, { NextFunction, Request, Response } from 'express';
import * as DiscordService from '../services/discordService';
const router = express.Router();

router.post('/sendDm', async function (req: Request, res: Response) {
    const {clientId,message} = req.body
    // '983331140523933696','sone one spam you'
    const result = await DiscordService.sendDm(clientId,message);
    if(result.code===0){
        res.status(200).json(result)
    }else{
        res.status(200).json(result)
    }
});


export default router;