import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";

export const createNovel = async(req, res,next) => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/part/image`
    });
    req.body.image = { secure_url, public_id };
    console.log(req.body.image);
   
}                           