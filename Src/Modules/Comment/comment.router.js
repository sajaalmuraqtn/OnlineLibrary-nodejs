import { Router } from "express";
import * as CommentController from './Controller/comment.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
const router=Router();

router.post('/',asyncHandler(CommentController.createComment));

export default router;