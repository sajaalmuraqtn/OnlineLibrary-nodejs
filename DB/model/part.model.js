import mongoose, { Schema, Mongoose, model, Types } from "mongoose";

const PartSchema = new Schema(
    {
        title: {
            type: String,
            require: true
        },
        text: {
            type: String,
            require: true
        },
        image: {
            type: Object
        },
        readers:[{
            type: Types.ObjectId,
            ref: 'User'
        }],
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            require: true
        },
        novelId: {
            type: Types.ObjectId,
            ref: 'Novel',
            require: true
        }
    }, {
    timestamps: true
}
)

const PartModel = mongoose.models.Part || model('Part', PartSchema);
export default PartModel;