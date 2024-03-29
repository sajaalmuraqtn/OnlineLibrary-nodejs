import mongoose, { Schema, Mongoose, model, Types } from "mongoose";

const PartSchema = new Schema(
    {
        title: {
            type: String,
            require: true
        },
        slug: {
            type: String,
            required: true
        },
        text: {
            type: String,
            require: true
        },
        image: {
            type: Object
        },
        readers: [{
            type: Types.ObjectId,
            ref: 'User'
        }],
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
            require: true
        },
        status: {
            type: String,
            enum: ['Publish', 'Draft'],
            default: 'Draft'
        },
        deleteCode: {
            type: String,
            default: null
        },
        likesNumber: {
            type: Number,
            default: 0
        },
        likes: [
            {
                type: Types.ObjectId,
                ref: 'User'
            }
        ],
        commentsCount: {
            type: Number,
            default: 0
        },
        novelId: {
            type: Types.ObjectId,
            ref: 'Novel',
            require: true
        }
    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)

PartSchema.virtual('Comments', {
    localField: '_id',
    foreignField: 'partId',
    ref: 'Comment'
})

const PartModel = mongoose.models.Part || model('Part', PartSchema);
export default PartModel;