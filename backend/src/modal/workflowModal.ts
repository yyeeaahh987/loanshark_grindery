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

const WorkflowSchema: Schema = new Schema({
    // _id: Types.ObjectId,
    key: { type: String,require:true },
    userAccountId: { type: String,require:true },
    workflow: {
        title: { type: String },
        trigger: {
            type: { type: String },
            connector: { type: String },
            operation: { type: String },
            input: { type: Object },
            // input: {
            //     ratio: { type: String },
            // }
        },
        actions: [{
            type: { type: String },
            connector: { type: String },
            operation: { type: String },
            input: { type: Object },
            // input: {
            //     _grinderyGasLimit: { type: String },
            //     healthFactorIsBelow: { type: String }
            // }
        }]
    },
    enabled: Boolean,
    createdAt: {
        $numberLong: { type: String }
    },
    updatedAt: {
        $numberLong: { type: String }
    },
    state: String,
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const Workflow: Model<any> = model('Workflow', WorkflowSchema);