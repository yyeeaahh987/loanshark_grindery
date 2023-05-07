import { Workflow }from '../modal/workflowModal'
import {Test} from '../modal/testModal';
import { Employee } from '../modal/employeeModel';

export async function getWorkflowByAddress(address:String){
    try{
        const workflowArr = await Workflow.find({userAccountId:`eip155:1:${address}`});
        return {
            code:0,
            message:"success",
            result:workflowArr
        }
    }
    catch(e){
        console.log(e)
        return {
            code:-1,
            message:e,
            result:[]
        }
    }
}

export async function saveWorkflows(workflow:any){
    console.log(`saveWorkflows service`,workflow)
    try{
        const saveRespond = await Workflow.create(workflow);
        console.log(saveRespond)
        return {
        code:0,
        message:"success",
        result:saveRespond
    }
    }
    catch(e){
        return {
            code:-1,
            message:"fail",
            result:{}
        }
    }
}

export async function updateWorkflowByKey(workflow:any){
    console.log(`updateWorkflowByKey service`,workflow)
    try{
        const workflowUpdateRes = await Workflow.findOneAndUpdate({key:workflow.key},workflow,{new:true})
        return {
            code:0,
            message:"success",
            result:workflowUpdateRes            
        }
    }
    catch(e){
        return {
            code:-1,
            message:"fail",
            result:{}
        }
    }
}

export async function deleteWorkflowByKey(key:any){
    console.log(`deleteWorkflowByKey service`,key)
    try{
        const workflowUpdateRes = await Workflow.findOneAndRemove(key,{new:true})
        return {
            code:0,
            message:"success",
            result:workflowUpdateRes            
        }
    }
    catch(e){
        return {
            code:-1,
            message:"fail",
            result:{}
        }
    }
}


export async function trypost(){
    try{
        const result = await Employee.find();
        console.log(`result: `,result)
    }catch(e){
        console.log(e)
    }
    return 
}
// default export class workflowServices(){
   
// }

// export WorkflowServices