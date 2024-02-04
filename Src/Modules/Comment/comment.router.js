import { Router } from "express";
import * as CommentController from './Controller/comment.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth, roles } from "../../Middleware/auth.js";
const router=Router({mergeParams:true});

router.post('/addComment',auth(Object.values(roles)),asyncHandler(CommentController.createComment));
router.get('/getAllComments',auth(Object.values(roles)),asyncHandler(CommentController.getAllComments));
router.delete('/deleteComment/:commentId',auth(Object.values(roles)),asyncHandler(CommentController.deleteComment));

export default router;