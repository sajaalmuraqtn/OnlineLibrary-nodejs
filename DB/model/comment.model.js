import mongoose, { Schema,Mongoose, model, Types } from "mongoose";

const commentSchema=new Schema(
    {
        text:{
            type:String,
            require:true
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'User',
            require:true
        },
        createdByName:{
            type:String,
            require:true
        },
        partId:{
            type:Types.ObjectId,
            ref:'Part',
            require:true
        },
        novelId: {
            type: Types.ObjectId,
            ref: 'Novel',
            require: true
        }
    },{
        timestamps:true 
    }
) 
 
const CommentModel=mongoose.models.Comment||model('Comment',commentSchema);
export default CommentModel;