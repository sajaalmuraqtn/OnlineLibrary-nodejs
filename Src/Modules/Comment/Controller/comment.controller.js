import e from "express";
import CommentModel from "../../../../DB/model/comment.model.js";
import NovelModel from "../../../../DB/model/novel.model.js";
import PartModel from "../../../../DB/model/part.model.js";
import UserModel from "../../../../DB/model/user.model.js";

export const createComment = async (req, res,next) => {
    const user=await UserModel.findById(req.user._id);
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });
    if (!part) {
        return next(new Error("part not found", { cause: 404 }));
    }
    if (part.status == 'Draft') {
        return next(new Error("can not add comment in Draft part, part should publish first", { cause: 400 }));
    }

    if (!part.readers.includes(req.user._id)) {
        return next(new Error("You haven't read the part yet", { cause: 400 }));
    }
    req.body.createdBy=req.user._id;
    req.body.createdByName=user.userName;
    req.body.partId=req.params.partId;
    req.body.novelId=req.params.novelId;
   
    const newComment=await CommentModel.create(req.body);
    if (newComment) {
        part.commentsCount+=1;
    }
    else{
        return next(new Error("error while add comment", { cause: 400 }));
    }
    await part.save();
    return res.status(200).json({ message:'success',newComment,commentsCount: part.commentsCount});
}

export const getAllComments = async (req, res,next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });
    if (!part) {
        return next(new Error("part not found", { cause: 404 }));
    }
    if (part.status == 'Draft') {
        return next(new Error("can not add comment in Draft part, part should publish first", { cause: 400 }));
    }

    if (!part.readers.includes(req.user._id)) {
        return next(new Error("You haven't read the part yet", { cause: 400 }));
    }

    const comments=await CommentModel.find({ partId: req.params.partId, novelId: req.params.novelId});
    if (!comments) {
        return next(new Error("error while get all comments", { cause: 400 }));
    }
    return res.status(200).json({ message:'success',comments,commentsCount: part.commentsCount});
}

export const deleteComment = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });
    if (!part) {
        return next(new Error("part not found", { cause: 404 }));
    }
    if (part.status == 'Draft') {
        return next(new Error("can not delete comment in Draft part, part should publish first", { cause: 400 }));
    }

    if (!part.readers.includes(req.user._id)) {
        return next(new Error("You haven't read the part yet", { cause: 400 }));
    }

    const deleteComment=await CommentModel.findOneAndDelete({_id:req.params.commentId,partId: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });
    if (deleteComment) {
        part.commentsCount-=1;
    }else{
        return next(new Error("error while delete comment", { cause: 400 }));
    }
    await part.save();
    return res.status(200).json({ message:'success',deleteComment,commentsCount: part.commentsCount});
}                           