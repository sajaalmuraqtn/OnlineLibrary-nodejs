import mongoose, { Schema, Mongoose, model, Types } from "mongoose";

const NovelSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: Object,
            required: true,
        },
        readersCount: {
            type: Number,
            required: true,
            default: 0
        },
        partCount:{
            type: Number,
            required: true,
            default: 0
        },
        favoritesCount: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: String,
            enum: ['Publish', 'Draft'],
            default: 'Draft'
        },
        finish: {
            type: Boolean,
            default: 'false'
        },
        type: {
            type: String,
            enum: ['none', "Emotional", "Horror", "Action", "Historical", "School"],
            default: 'none'
        },
        deleteCode:{
            type: String,
            default: null
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdByName: {
            type:String,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

NovelSchema.virtual('Parts', {
    localField: '_id',
    foreignField: 'novelId',
    ref: 'Part'
})
const NovelModel = mongoose.models.Novel || model('Novel', NovelSchema);
export default NovelModel;