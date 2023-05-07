import { model, Schema, Model, Document, Types } from 'mongoose';

interface IWorkflow extends Document {
    _id: Types.ObjectId;
    key: String;
    userAccountId: string;
    workflow: object;
    enabled: boolean;
    createdAt: object;
    updatedAt: object;
    state: boolean;
}

const EmployeeSchema: Schema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    mobile:{type:String, required:true},
    password:{type:String, required:true},
    // title:String,
    // published:{
    //     type:Date,
    //     default:Date.now
    // },
    // keywords:Array,
    // published:Boolean
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const Employee: Model<any> = model('Employee', EmployeeSchema);