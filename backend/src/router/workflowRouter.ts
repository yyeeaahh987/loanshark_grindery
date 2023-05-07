import express, { NextFunction, Request, Response } from 'express';
// import { ApiError, createApiResponse } from '../services/model';
import * as WorkflowServices from '../services/workflowServices';

const router = express.Router();
// const workflowServices = new WorkflowServices()
router.get('/getWorkflowByAddress/:address', async function (req: Request, res: Response) {
    //   console.log(req, res)
    const { address } = req.params
    const result = await WorkflowServices.getWorkflowByAddress(address);
    if(result.code===0){
        res.status(200).json(result)
    }else{
        res.status(503).json(result)
    }
    
});

router.post('/saveWorkflows', async function (req: Request, res: Response) {
    //   console.log(req, res)
    // const { body } = req.body
    console.log(`savework`,req.body)
    const result = await WorkflowServices.saveWorkflows(req.body);
    if(result.code===0){
        res.status(200).json(result)
    }else{
        res.status(503).json(result)
    }
    
});


router.post('/updateWorkflowByKey', async function (req: Request, res: Response) {
    const result = await WorkflowServices.updateWorkflowByKey(req.body);
    if(result.code===0){
        res.status(200).json(result)
    }else{
        res.status(503).json(result)
    }    
});

router.post('/deleteWorkflowByKey', async function (req: Request, res: Response) {
    const result = await WorkflowServices.deleteWorkflowByKey(req.body);
    if(result.code===0){
        res.status(200).json(result)
    }else{
        res.status(503).json(result)
    }    
});

router.post('/trypost', function (req: Request, res: Response) {
    WorkflowServices.trypost();
    res.status(200).json({message:"success"})
})


export default router;
