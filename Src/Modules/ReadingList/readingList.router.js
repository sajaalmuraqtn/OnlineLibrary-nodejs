import { Router } from "express";
import * as ReadingListController from './Controller/readingList.controller.js'
 import { asyncHandler } from "../../Services/errorHandling.js";
import { auth, roles } from "../../Middleware/auth.js";

const router = Router({ mergeParams: true });


router.post(' /createReadingList', auth(Object.values(roles)), asyncHandler(ReadingListController.createReadingList));
router.patch('/removeNovelFromReadingList', auth(Object.values(roles)), asyncHandler(ReadingListController.removeNovelFromReadingList));
router.delete('/deleteNovelFromReadingList', auth(Object.values(roles)), asyncHandler(ReadingListController.deleteNovelFromReadingList));




export default router;