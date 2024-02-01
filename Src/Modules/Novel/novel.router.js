import { Router } from "express";
import * as NovelController from './Controller/novel.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import PartRouter from '../Part/part.router.js'
import { endPoint } from "./novel.endpoint.js";
import { auth } from "../../Middleware/auth.js";

const router = Router();

router.use('/:novelId/Part', PartRouter);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), asyncHandler(NovelController.createNovel)); 
router.put('/:novelId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), asyncHandler(NovelController.updateNovel));
 router.get('/', asyncHandler(NovelController.getAllPublishNovels));
router.get('/MyNovels/:userId', auth(endPoint.myNovels), asyncHandler(NovelController.getMyNovels));
router.patch('/publish/:novelId', auth(endPoint.publish), asyncHandler(NovelController.publishNovel));
router.patch('/unPublish/:novelId', auth(endPoint.publish), asyncHandler(NovelController.unPublishNovel));
router.get('/:id', auth(endPoint.create), asyncHandler(NovelController.getSpecificNovel));
router.patch('/sendDeleteNovelCode/:novelId', auth(endPoint.sendDeleteNovelCode), asyncHandler(NovelController.sendDeleteNovelCode));
router.delete('/deleteNovel/:novelId', auth(endPoint.delete), asyncHandler(NovelController.deleteNovel));

export default router