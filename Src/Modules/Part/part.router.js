import { Router } from "express";
import * as PartController from './Controller/part.controller.js'
import  CommentRouter from '../Comment/comment.router.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { endPoint } from "./part.endpoint.js"; 
import { auth, roles } from "../../Middleware/auth.js";
const router=Router({mergeParams:true});

router.use('/:partId/comment',CommentRouter);
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image') ,asyncHandler(PartController.createPart));
router.put('/:partId',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(PartController.updatePart));
router.get('/',auth(Object.values(roles)),asyncHandler(PartController.getAllPart)); 
router.patch('/publish/:partId',auth(endPoint.publish),asyncHandler(PartController.publishPart));
router.patch('/unPublish/:partId',auth(endPoint.publish),asyncHandler(PartController.unPublishPart));
router.patch('/likeUnlike/:partId',auth(Object.values(roles)),asyncHandler(PartController.likeUnlike));
router.get('/:partId',auth(Object.values(roles)),asyncHandler(PartController.getSpecificPart)); 
router.patch('/sendDeletePartCode/:partId',auth(endPoint.sendDeletePartCode),asyncHandler(PartController.sendDeletePartCode)); 
router.delete('/deletePart/:partId',auth(endPoint.delete),asyncHandler(PartController.deletePart)); 
export default router; 