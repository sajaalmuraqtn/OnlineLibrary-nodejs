import mongoose, { Schema, Types, model } from "mongoose";

const ReadingListSchema = new Schema({
    createdBy: {
        type: Types.ObjectId, ref: 'User', required: true
    },
    name: {
        type: String, required: true
    },
    novels: [
        {
            novelId: { type: Types.ObjectId, ref: 'Novel', required: true },
            image: { type: Object, required: true },
            title: { type: String, required: true },
            createdByName: { type: String, required: true },
        }
    ],
    novelsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})


const ReadingListModel = mongoose.models.ReadingList || model('ReadingList', ReadingListSchema);
export default ReadingListModel;