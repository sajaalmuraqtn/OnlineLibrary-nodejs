import mongoose, { Schema,Mongoose, model, Types } from "mongoose";

const commentSchema=new Schema(
    {
        text:{
            type:String,
            require:true
        },
        userId:{
            type:Types.ObjectId,
            ref:'User',
            require:true
        },
        partId:{
            type:Types.ObjectId,
            ref:'Part',
            require:true
        }
    },{
        timestamps:true
    }
)

const CommentModel=mongoose.models.Comment||model('Comment',commentSchema);
export default CommentModel;