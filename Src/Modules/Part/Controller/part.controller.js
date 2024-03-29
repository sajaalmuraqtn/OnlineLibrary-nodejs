import slugify from "slugify";
import PartModel from "../../../../DB/model/part.model.js";
import NovelModel from "../../../../DB/model/novel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from '../../../Services/email.js';
import CommentModel from "../../../../DB/model/comment.model.js";


export const createPart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ createdBy: req.user._id, _id: req.params.novelId });
    if (!novel) {
        return next(new Error("can not add part", { cause: 400 }));
    }
    const title = req.body.title.toLowerCase();
    if (await PartModel.findOne({ title, novelId: req.params.novelId }).select('title')) {
        return next(new Error("Part title already exist in this novel", { cause: 409 }));
    }
    req.body.title = title;
    req.body.slug = slugify(title);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/novel/part/image`
    });
    req.body.image = { secure_url, public_id };
    req.body.novelId = req.params.novelId;
    req.body.createdBy = req.user._id;
    const Part = await PartModel.create(req.body);
    if (!Part) {
        return next(new Error("Error while creating part", { cause: 400 }));
    }
    return res.status(201).json({ message: 'success', Part });
}


export const updatePart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ createdBy: req.user._id, _id: req.params.novelId });
    if (!novel) {
        return next(new Error("can not add part", { cause: 400 }));
    }
    const Part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id })
    if (!Part) {
        return next(new Error("can not found the part", { cause: 404 }));
    }
    if (req.body.title) {
        const title = req.body.title.toLowerCase();

        if (title == Part.title) {
            return next(new Error("part title never change", { cause: 409 }));
        }
        console.log(await PartModel.findOne({ title }).select('title'));
        if (await PartModel.findOne({ title }).select('title')) {
            return next(new Error("part title already exist", { cause: 409 }));
        }
        Part.title = title;
        Part.slug = slugify(title);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/novel/image`
        });
        await cloudinary.uploader.destroy(category.image.public_id);
        Part.image = { secure_url, public_id };
    }
    if (req.body.text) {
        Part.text = req.body.text;
    }
    await Part.save()

    return res.status(201).json({ message: 'success', Part });
}


export const getAllPart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    const Parts = await PartModel.find({ novelId: req.params.novelId, status: 'Publish' }).select("title status");
    if (novel) {
        const AllParts = await PartModel.find({ novelId: req.params.novelId }).select("title status");
        return res.status(201).json({ message: 'success', AllParts });
    }
    return res.status(201).json({ message: 'success', Parts });
}


export const getSpecificPart = async (req, res, next) => {
    const novel = await NovelModel.findById(req.params.novelId);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId }).populate('Comments');
    if (!part.readers.includes(req.user._id)) {
        part.readers.push(req.user._id);
        novel.readersCount += 1
        await part.save()
        await novel.save()
    }

    return res.status(201).json({ message: 'success', part, novelReadersCount: novel.readersCount });
}

export const publishPart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    if (novel.status == 'Draft') {
        return next(new Error("can not publish part, novel should publish first", { cause: 400 }));
    }

    const PublishPart = await PartModel.findOne({ novelId: req.params.novelId, createdBy: req.user._id, _id: req.params.partId });
    if (PublishPart.status== 'Publish' ) {
        return next(new Error("part already published", { cause: 409 }));
    }
    PublishPart.status='Publish';
    await PublishPart.save()
    novel.partCount+=1;
    await novel.save();
    return res.status(201).json({ message: 'success', PublishPart,partCount:novel.partCount });
}

export const unPublishPart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    const unPublishPart =  await PartModel.findOne({ novelId: req.params.novelId, createdBy: req.user._id, _id: req.params.partId });
    if (unPublishPart.status== 'Draft' ) {
        return next(new Error("part already Draft", { cause: 409 }));
    }
    unPublishPart.status='Draft';
    await unPublishPart.save()
    novel.partCount-=1;
    await novel.save();
    return res.status(201).json({ message: 'success', unPublishPart,partCount:novel.partCount });
}

export const likeUnlike = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId });
    if (part.status == 'Draft') {
        return next(new Error("can not like Draft part, part should publish first", { cause: 400 }));
    }

    if (!part.readers.includes(req.user._id)) {
        return next(new Error("You haven't read the part yet", { cause: 400 }));
    }

    if (part.likes.includes(req.user._id)) {
        const unLike = await PartModel.findOneAndUpdate({ _id: req.params.partId, novelId: req.params.novelId }, { $pull: { likes: req.user._id }, $inc: { likesNumber: -1 } }, { new: true });
        novel.favoritesCount -= 1
        await novel.save()
        return res.status(201).json({ message: 'success', unLike, favoritesCountNovel: novel.favoritesCount });
    }

    const like = await PartModel.findOneAndUpdate({ _id: req.params.partId, novelId: req.params.novelId }, { $addToSet: { likes: req.user._id }, $inc: { likesNumber: 1 } }, { new: true });
    novel.favoritesCount += 1
    await novel.save()
    return res.status(201).json({ message: 'success', like, favoritesCountNovel: novel.favoritesCount });
}

export const sendDeletePartCode = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const part = await PartModel.findOne({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });
    if (!part) {
        return next(new Error("part not found", { cause: 404 }));
    }
    const email = req.user.email;// to send email to the person 

    let code = customAlphabet('123456789abcdzABCDZ', 4);
    code = code();

    const html = `<h2>delete Part code : ${code}</h2>`
    sendEmail(email, 'delete Part code', html);
    await PartModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.partId, novelId: req.params.novelId }, { deleteCode: code }, { new: true });
    return res.redirect(process.env.FORGOTPASSWORDFORM);
}

export const deletePart = async (req, res, next) => {
    const novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id });
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    const deleteCode = req.body.deleteCode;
    const deletePart = await PartModel.findOneAndDelete({ _id: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id, deleteCode });
    const deleteComments = await CommentModel.deleteMany({ partId: req.params.partId, novelId: req.params.novelId, createdBy: req.user._id });

    if (!deletePart) {
        return next(new Error("part not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', deletePart ,deleteComments});
}                           