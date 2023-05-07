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

const BookSchema: Schema = new Schema({
    title:String,
    // published:{
    //     type:Date,
    //     default:Date.now
    // },
    keywords:Array,
    published:Boolean
});

// const User: Model<WorkflowSchema> = model('Workflow', WorkflowSchema);
export const Book: Model<any> = model('Book', BookSchema);