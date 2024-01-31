import { Router } from "express";
import * as PartController from './Controller/part.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { endPoint } from "./part.endpoint.js";
import { auth } from "../../Middleware/auth.js";
const router=Router({mergeParams:true});


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),asyncHandler(PartController.createPart));
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(PartController.createNovel));
router.get('/',asyncHandler(PartController.getAllPublishNovels));
router.get('/MyNovels/:id',auth(endPoint.myNovels),asyncHandler(PartController.getMyNovels));
router.patch('/publish/:id',auth(endPoint.publish),asyncHandler(PartController.publishNovel));
router.patch('/unPublish/:id',auth(endPoint.publish),asyncHandler(PartController.unPublishNovel));
router.get('/:id',auth(endPoint.create),asyncHandler(PartController.getSpecificNovel)); 
router.patch('/sendDeleteNovelCode/:id',auth(endPoint.sendDeleteNovelCode),asyncHandler(PartController.sendDeleteNovelCode)); 
router.delete('/deleteNovel/:id',auth(endPoint.delete),asyncHandler(PartController.deleteNovel)); 
export default router;