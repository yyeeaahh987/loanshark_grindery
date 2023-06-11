// import fetch from 'node-fetch'
import { v4 as uuidv4} from 'uuid'
import {SubscriberInformationModal} from '../../types/SubscriberInformationModal'
const LOCAL_SERVER =process.env.REACT_APP_SERVER_URL;
console.log(`local server address`,LOCAL_SERVER)
export async function addSubscriberInformation(requestBody:SubscriberInformationModal){
    try{
        let result = await fetch(`${LOCAL_SERVER}/workflow/addSubscriberInformation`,{
            // headers:{
            //     mode: "no-cors",
            //     // 'Access-Control-Allow-Origin':"*"       
            // }
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(requestBody)
        })
        if(result.status===200){
            let res:any = await result.json()
            return res.result
        }
    }
    catch(e){
    }
    return []
}

// export async function saveWorkflowsByDatabase(newWorkflow:any){
//     const newUuid = uuidv4();
//     const newPostObj = {
//         key:`staging-${newUuid}`,
//         userAccountId:newWorkflow.creator,
//         enabled:false,
//         createdAt:"",
//         updatedAt:"",
//         state:"off",
//         workflow:{
//             ...newWorkflow,
//             key:`staging-${newUuid}`,
//         },
//     }
//     try{
//         let result = await fetch(`${LOCAL_SERVER}/workflow/saveWorkflows`,{
//             method:"POST",
//             headers: { 'Content-Type': 'application/json' },
//             body:JSON.stringify(newPostObj)
//         })
//         if(result.status===200){
//             let res:any = await result.json()
//             return res.result
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
//     return {}
// }

// export async function updateWorkflowByKey(editWorkflow:any){
//     const newPostObj = {
//         key:editWorkflow.key,
//         userAccountId:editWorkflow.creator,
//         enabled:false,
//         createdAt:"",
//         updatedAt:"",
//         state:"off",
//         workflow:editWorkflow,
//     }
//     try{
//         let result = await fetch(`${LOCAL_SERVER}/workflow/updateWorkflowByKey`,{
//             method:"POST",
//             headers: { 'Content-Type': 'application/json' },
//             body:JSON.stringify(newPostObj)
//         })
//         if(result.status===200){
//             let res:any = await result.json()
//             return res.result
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
//     return {}
// }

// export async function deleteWorkflowByKey(key:any){
//     console.log(`deleteWorkflowByKey`,key)
//     const newPostObj = {
//         key,
//         // userAccountId:deleteWorkflow.creator,
//         // enabled:false,
//         // createdAt:"",
//         // updatedAt:"",
//         // state:"off",
//         // workflow:deleteWorkflow,
//     }
//     try{
//         let result = await fetch(`${LOCAL_SERVER}/workflow/deleteWorkflowByKey`,{
//             method:"POST",
//             headers: { 'Content-Type': 'application/json' },
//             body:JSON.stringify(newPostObj)
//         })
//         if(result.status===200){
//             let res:any = await result.json()
//             return res.result
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
//     return {}
// }