import mongoose, { Schema, Mongoose, model, Types } from "mongoose";

const NovelSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image:{
            type:Object,
            required:true,
        },
        readers:[{
            type: Types.ObjectId,
            ref: 'User'
        }],
        type: {
            type: String,
            enum: ['Emotional', 'Horror','Action', 'Kiddrama','Historical'],
            default: 'none'
        }, 
        library:[{
            image:{
                type:Object,
                required:true,
            },
        }],   
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, {
    timestamps: true
}
)

const NovelModel = mongoose.models.Novel || model('Novel', NovelSchema);
export default NovelModel;