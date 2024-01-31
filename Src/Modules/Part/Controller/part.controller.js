import slugify from "slugify";
import PartModel from "../../../../DB/model/part.model.js";
import NovelModel from "../../../../DB/model/novel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from '../../../Services/email.js';


export const createPart = async (req, res, next) => {

    if (! await NovelModel.findOne({ createdBy: req.user._id, novelId: req.params.novelId })) {
        return next(new Error("can not add part", { cause: 400 }));
    }
    const title = req.body.title.toLowerCase();
    if (await PartModel.findOne({ title, novelId: req.params.novelId }).select('title')) {
        return next(new Error("Part title already exist in your novel", { cause: 409 }));
    }
    req.body.title = title;
    req.body.slug = slugify(title);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/novel/part/image`
    });
    req.body.image = { secure_url, public_id };
    req.body.novelId=req.params.novelId;
    req.body.createdBy = req.user._id;
    const Part = await NovelModel.create(req.body);
    if (!Part) {
        return next(new Error("Error while creating part", { cause: 400 }));
    }
    return res.status(201).json({ message: 'success', Part });
}


export const updatePart = async (req, res, next) => {
    const Part = await PartModel.findOne({ _id: req.params.id, novelId: req.params.novelId, createdBy: req.user._id })
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
    if (req.body.description) {
        Part.description = req.body.description;
    }
    if (req.body.type) {
        Part.type = req.body.type;
    }
    await Part.save()

    return res.status(201).json({ message: 'success', Novel: Part });
}


export const getAllPublishParts = async (req, res, next) => {
    const novels = await PartModel.find({ status: 'Publish' });
    return res.status(201).json({ message: 'success', novels });
}

export const getMyParts = async (req, res, next) => {
    const novels = await PartModel.find({ createdBy: req.params.id });
    if (novels.length == 0) {
        return next(new Error("You haven't created any novels yet", { cause: 400 }));
    }
    return res.status(201).json({ message: 'success', novels });
}

export const getSpecificPart = async (req, res, next) => {
    const novel = await PartModel.findById(req.params.id);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', novel });
}

export const publishPart = async (req, res, next) => {
    const PublishNovel = await PartModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { status: 'Publish' }, { new: true });
    return res.status(201).json({ message: 'success', PublishNovel });
}

export const unPublishPart = async (req, res, next) => {
    const unPublishNovel = await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { status: 'Draft' }, { new: true });
    const unPublishParts = await PartModel.findOneAndUpdate({ createdBy: req.user._id, novelId: req.params.id }, { status: 'Draft' }, { new: true });
    return res.status(201).json({ message: 'success', unPublishNovel });
}

export const sendDeletePart = async (req, res, next) => {
    const email = req.user.email;// to send email to the person 

    let code = customAlphabet('123456789abcdzABCDZ', 4);
    code = code();

    const html = `<h2>delete Part code : ${code}</h2>`
    sendEmail(email, 'delete Part code', html);
    await PartModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.id }, { deleteCode: code }, { new: true });
    return res.redirect(process.env.FORGOTPASSWORDFORM);
}

export const deletePart = async (req, res, next) => {
    const deleteCode = req.body.deleteCode;
    const deletePart = await PartModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id, deleteCode });

    if (!deletePart) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', deleteNovel, deleteParts });
}                           