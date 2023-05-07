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

const TestSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    field1: {type:String, required:true},
    // userAccountId: String,
    // workflow: {
    //     title: { type: String },
    //     trigger: {
    //         type: { type: String },
    //         connector: { type: String },
    //         operation: { type: String },
    //         input: {
    //             ratio: { type: String },
    //         }
    //     },
    //     actions: [{
    //         type: { type: String },
    //         connector: { type: String },
    //         operation: { type: String },
    //         input: {
    //             _grinderyGasLimit: { type: String },
    //             healthFactorIsBelow: { type: String }
    //         }
    //     }]
    // },
    // enabled: Boolean,
    // createdAt: {
    //     $numberLong: { type: String }
    // },
    // updatedAt: {
    //     $numberLong: { type: String }
    // },
    // state: Boolean,
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const Test: Model<any> = model('Test', TestSchema);