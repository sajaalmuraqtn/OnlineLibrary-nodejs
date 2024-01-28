import { Router } from "express";
import * as NovelController from './Controller/novel.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import PartRouter from '../Part/part.router.js'

const router=Router();

router.use('/:id/Part',PartRouter);
router.post('/',asyncHandler(NovelController.createNovel));

export default router