// import fetch from 'node-fetch'
import {SubscriberInformationModal} from '../../types/SubscriberInformationModal'
const LOCAL_SERVER =process.env.REACT_APP_SERVER_URL;
export async function addSubscriberInformation(requestBody:SubscriberInformationModal){
    try{
        let result = await fetch(`${LOCAL_SERVER}/noitifcation/addSubscriberInformation`,{
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
    return {}
}

export async function getSubscriberInformationByKey(requestBody:SubscriberInformationModal){
    try{
        let result = await fetch(`${LOCAL_SERVER}/noitifcation/getSubscriberInformationByKey`,{
            // headers:{
            //     mode: "no-cors",
            //     // 'Access-Control-Allow-Origin':"*"       
            // }
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(requestBody)
        })
        console.log(result)
        if(result.status===200){
            let res:any = await result.json()
            console.log(res)
            return res
        }
    }
    catch(e){
    }
    return {}
}

export async function updateSubscriberInformation(requestBody:SubscriberInformationModal){
    try{
        let result = await fetch(`${LOCAL_SERVER}/noitifcation/updateSubscriberInformation`,{
            // headers:{
            //     mode: "no-cors",
            //     // 'Access-Control-Allow-Origin':"*"       
            // }
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(requestBody)
        })
        console.log(result)
        if(result.status===200){
            let res:any = await result.json()
            console.log(res)
            return res
        }else{
            
        }
    }
    catch(e){
    }
    return {}
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