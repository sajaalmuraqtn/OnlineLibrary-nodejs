import slugify from "slugify";
import NovelModel from "../../../../DB/model/novel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from '../../../Services/email.js';
import PartModel from "../../../../DB/model/part.model.js";
import UserModel from "../../../../DB/model/user.model.js";
import CommentModel from "../../../../DB/model/comment.model.js";
import { pagination } from "../../../Services/pagination.js";


export const createNovel = async (req, res, next) => {
    const title = req.body.title.toLowerCase();
    if (await NovelModel.findOne({ title }).select('title')) {
        return next(new Error("title already exist", { cause: 409 }));
    }
    req.body.title = title;
    req.body.slug = slugify(title);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/novel/image`
    });
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.createdByName = req.user.userName;
    const novel = await NovelModel.create(req.body);
    return res.status(201).json({ message: 'success', novel });
}

export const updateNovel = async (req, res, next) => {
    const Novel = await NovelModel.findOne({ _id: req.params.novelId, createdBy: req.user._id })
    if (!Novel) {
        return next(new Error("can not found the novel", { cause: 404 }));
    }
    if (req.body.title) {
        const title = req.body.title.toLowerCase();

        if (title == Novel.title) {
            return next(new Error("title never change", { cause: 409 }));
        }
        console.log(await NovelModel.findOne({ title }).select('title'));
        if (await NovelModel.findOne({ title }).select('title')) {
            return next(new Error("title already exist", { cause: 409 }));
        }
        Novel.title = title;
        Novel.slug = slugify(title);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/novel/image`
        });
        await cloudinary.uploader.destroy(category.image.public_id);
        Novel.image = { secure_url, public_id };
    }
    if (req.body.description) {
        Novel.description = req.body.description;
    }
    if (req.body.type) {
        Novel.type = req.body.type;
    }
    if (req.body.finish) {
        Novel.finish = req.body.finish;
    }
    await Novel.save()

    return res.status(201).json({ message: 'success', Novel });
}

export const getAllPublishNovels = async (req, res, next) => {
    
    const { limit, skip } = pagination(req.query.page, req.query.limit);

    let queryObj = { ...req.query };
    const execQuery = ['page', 'limit', 'skip', 'sort', 'search','fields'];
    execQuery.map((ele) => {
        delete queryObj[ele];
    })

    const mongooseQuery = NovelModel.find(queryObj).limit(limit).skip(skip);
    if (req.query.search) {
        mongooseQuery.find({
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        })
    }
    if (req.query.fields) {
        mongooseQuery.select(req.query.fields?.replaceAll(',', ' '))
    }

    const count = await NovelModel.estimatedDocumentCount();
    const novels = await mongooseQuery.find({ status: 'Publish' }).sort(req.query.sort?.replaceAll(',', ' '));
    return res.status(201).json({ message: 'success', novels,page: novels.length, total: count });
}

export const getMyNovels = async (req, res, next) => {
    const novels = await NovelModel.find({ createdBy: req.params.userId });
    if (novels.length == 0) {
        return next(new Error("You haven't created any novels yet", { cause: 400 }));
    }
    return res.status(201).json({ message: 'success', novels });
}

export const getSpecificNovel = async (req, res, next) => {
    console.log(req.params.novelId);
    const novel = await NovelModel.findById(req.params.novelId).populate('Parts');
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', novel });
}

export const addNovelToMyLibrary = async (req, res, next) => {
    const novel = await NovelModel.findById(req.params.novelId);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    const user = await UserModel.findById(req.user._id);

    for (let index = 0; index < user.library.length; index++) {
        if (user.library[index].novelId == req.params.novelId) {
            return next(new Error("novel already exist in your library", { cause: 409 }));
        }
    }
    user.library.push({ image: novel.image, title: novel.title, createdBy: novel.createdBy, createdByName: novel.createdByName, novelId: req.params.novelId });
    await user.save();
    return res.status(201).json({ message: 'success', library: user.library });

}

export const removeNovelFromMyLibrary = async (req, res, next) => {
    const novel = await NovelModel.findById(req.params.novelId);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    const user = await UserModel.findById(req.user._id)

    for (let index = 0; index < user.library.length; index++) {
        if (user.library[index].novelId == req.params.novelId) {
            const user = await UserModel.findByIdAndUpdate(req.user._id, { $pull: { library: { image: novel.image, title: novel.title, createdBy: novel.createdBy, createdByName: novel.createdByName, novelId: req.params.novelId } } }, { new: true })
            return res.status(201).json({ message: 'success', library: user.library });
        }
    }
    return next(new Error("novel not exist in your library", { cause: 409 }));
}


export const publishNovel = async (req, res, next) => {
    const PublishNovel = await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.novelId }, { status: 'Publish' }, { new: true });
    return res.status(201).json({ message: 'success', PublishNovel });
}

export const unPublishNovel = async (req, res, next) => {
    const unPublishNovel = await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.novelId }, { status: 'Draft' }, { new: true });
    const unPublishParts = await PartModel.updateMany({ createdBy: req.user._id, novelId: req.params.novelId }, { status: 'Draft' }, { new: true });
    return res.status(201).json({ message: 'success', unPublishNovel,unPublishParts });
}

export const sendDeleteNovelCode = async (req, res, next) => {
    const email = req.user.email;// to send email to the person 

    let code = customAlphabet('123456789abcdzABCDZ', 4);
    code = code();

    const html = `<h2>delete novel code : ${code}</h2>`
    sendEmail(email, 'delete novel code', html);
    await NovelModel.findOneAndUpdate({ createdBy: req.user._id, _id: req.params.novelId }, { deleteCode: code }, { new: true });
    return res.redirect(process.env.FORGOTPASSWORDFORM);
}

export const deleteNovel = async (req, res, next) => {
    const deleteCode = req.body.deleteCode;
    const deleteNovel = await NovelModel.findOneAndDelete({ _id: req.params.novelId, createdBy: req.user._id, deleteCode });
    const deleteParts = await PartModel.deleteMany({ createdBy: req.user._id, novelId: req.params.novelId });
    const deleteComments = await CommentModel.deleteMany({ novelId: req.params.novelId, createdBy: req.user._id });

    if (!deleteNovel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    return res.status(201).json({ message: 'success', deleteNovel, deleteParts,deleteComments });
}                           