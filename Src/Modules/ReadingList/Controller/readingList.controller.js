import { trusted } from "mongoose";
import NovelModel from "../../../../DB/model/novel.model.js";
import ReadingListModel from "../../../../DB/model/readingList.model.js";

export const createReadingList = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await ReadingListModel.findOne({ name, createdBy: req.user._id }).select('name')) {
        return next(new Error("name already exist", { cause: 409 }));
    }
    req.body.name = name;
    req.body.createdBy = req.user._id;
    req.body.novels = [];
    const ReadingList = await ReadingListModel.create(req.body);
    return res.status(201).json({ message: 'success', ReadingList });

}
export const addNovelToReadingList = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    const ReadingList = await ReadingListModel.findOne({ name, createdBy: req.user._id });

    if (!ReadingList) {
        return next(new Error("Reading List Not Found", { cause: 404 }));
    }

    const novel = await NovelModel.findById(req.params.novelId);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }

    for (let index = 0; index < ReadingList.novels.length; index++) {
        if (ReadingList.novels[index].novelId == req.params.novelId) {
            return next(new Error("novel already exist in this Reading List", { cause: 409 }));
        }
    }

    ReadingList.novels.push({ image: novel.image, title: novel.title, createdByName: novel.createdByName, novelId: req.params.novelId });
    ReadingList.novelsCount += 1;
    await ReadingList.save();
    return res.status(201).json({ message: 'success', ReadingList });

}

export const removeNovelFromReadingList = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    const ReadingList = await ReadingListModel.findOne({ name, createdBy: req.user._id });

    if (!ReadingList) {
        return next(new Error("Reading List Not Found", { cause: 404 }));
    }

    const novel = await NovelModel.findById(req.params.novelId);
    if (!novel) {
        return next(new Error("novel not found", { cause: 404 }));
    }
    let matched = false;

    for (let index = 0; index < ReadingList.novels.length; index++) {
        if (ReadingList.novels[index].novelId == req.params.novelId) {
            matched = true;
            break;
        }
    }
    if (matched) {
        const removeFromReadingList = await ReadingListModel.findOneAndUpdate({ name, createdBy: req.user._id }, { $pull: { novels: { image: novel.image, title: novel.title, createdByName: novel.createdByName, novelId: req.params.novelId } }, $inc: { novelsCount: -1 } }, { new: true });
        return res.status(201).json({ message: 'success', removeFromReadingList });
    } else {
        return next(new Error("novel not exist in this Reading List", { cause: 404 }));
    }
}

export const getMyReadingLists = async (req, res, next) => {
    const ReadingList = await ReadingListModel.find({ createdBy: req.user._id });

    if (ReadingList.length == 0) {
        return next(new Error("you do not have any reading lists yet", { cause: 400 }));
    }

    return res.status(201).json({ message: 'success', ReadingList });
}

export const getSpecificReadingLists = async (req, res, next) => {
    const ReadingList = await ReadingListModel.findOne({ _id: req.params.readingListId, createdBy: req.user._id });

    if (!ReadingList) {
        return next(new Error("Reading List Not Found", { cause: 404 }));
    }

    return res.status(201).json({ message: 'success', ReadingList });

}

export const deleteReadingList = async (req, res, next) => {
    const ReadingList = await ReadingListModel.findOneAndDelete({ _id: req.params.readingListId, createdBy: req.user._id });

    if (!ReadingList) {
        return next(new Error("Reading List Not Found", { cause: 404 }));
    }

    return res.status(201).json({ message: 'success', ReadingList });
}

