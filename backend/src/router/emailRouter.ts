import express, { NextFunction, Request, Response } from 'express';
import * as EmailServices from '../services/emailService';
const router = express.Router();

router.post('/sendEmail', async function (req: Request, res: Response) {
    // console.log(`sendEmail`,req.body)
    const {toList,ccList} = req.body
    const result = await EmailServices.sendEmail(toList,ccList);
    res.status(200).json(result)
});


export default router;
