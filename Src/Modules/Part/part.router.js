import { Router } from "express";
import * as PartController from './Controller/part.controller.js'
import fileUpload, { fileValidation } from "../../Services/multer.js";
import { asyncHandler } from "../../Services/errorHandling.js";
const router=Router({mergeParams:true});

router.post('/',asyncHandler(PartController.createPart));
export default router;