import slugify from "slugify";
import NovelModel from "../../../../DB/model/novel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from '../../../Services/email.js';
import PartModel from "../../../../DB/model/part.model.js";


export const createNovel = async (req, res, next) => {
    const title = req.body.title.toLowerCase();
    if (await NovelModel.findOne({ title }).select('title')) {
        return next(new Error("title already exist", { cause: 409 }));
    }
    req.body.slug = slugify(title);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/novel/image`
    });
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    const novel = await NovelModel.create(req.body);
    return res.status(201).json({ message: 'success', novel });
}

export const getAllPublishNovels = async (req, res, next) => {
    const novels = await NovelModel.find({ status: 'Publish' });
    return res.status(201).json({ message: 'success', novels });
}

export const getMyNovels = async (req, res, next) => {
    const novels = await NovelModel.find({ createdBy: req.params.id });
    if (novels.length == 0) {
        return next(new Error("You haven't created any novels yet", { cause: 400 }));
    }
    return res.status(201).json({ message: 'success', novels });
}

export const getSpecificNovel = async (req, res, next) => {
    const novel = await NovelModel.findById(req.params.id);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', novel });
}

export const publishNovel = async (req, res, next) => {
    const PublishNovel = await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { status: 'Publish' }, { new: true });
    return res.status(201).json({ message: 'success', PublishNovel });
}

export const unPublishNovel = async (req, res, next) => {
    const unPublishNovel = await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { status: 'Draft' }, { new: true });
    const unPublishParts = await PartModel.findOneAndUpdate({ createdBy: req.user._id, novelId: req.params.id }, { status: 'Draft' }, { new: true });
    return res.status(201).json({ message: 'success', unPublishNovel });
}

export const sendDeleteNovelCode = async (req, res, next) => {
    const email = req.user.email;// to send email to the person 

    let code = customAlphabet('123456789abcdzABCDZ', 4);
    code = code();

    const html = `<h2>delete novel code : ${code}</h2>`
    sendEmail(email, 'delete novel code', html);
    await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { deleteCode: code }, { new: true });
    return res.redirect(process.env.FORGOTPASSWORDFORM);
}

export const deleteNovel = async (req, res, next) => {
    const deleteCode = req.body.deleteCode;
    const deleteNovel = await NovelModel.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!deleteNovel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    {

    }
    return res.status(201).json({ message: 'success', });

}                           