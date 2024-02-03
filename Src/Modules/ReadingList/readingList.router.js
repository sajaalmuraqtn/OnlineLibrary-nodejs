import { Router } from "express";
import * as ReadingListController from './Controller/readingList.controller.js'
 import { asyncHandler } from "../../Services/errorHandling.js";
import { auth, roles } from "../../Middleware/auth.js";

const router = Router({ mergeParams: true });


router.post('/createReadingList', auth(Object.values(roles)), asyncHandler(ReadingListController.createReadingList));
router.patch('/addNovelToReadingList/:novelId', auth(Object.values(roles)), asyncHandler(ReadingListController.addNovelToReadingList));
router.patch('/removeNovelFromReadingList/:novelId', auth(Object.values(roles)), asyncHandler(ReadingListController.removeNovelFromReadingList));
router.get('/getMyReadingLists', auth(Object.values(roles)), asyncHandler(ReadingListController.getMyReadingLists));
router.get('/getSpecificReadingLists/:readingListId', auth(Object.values(roles)), asyncHandler(ReadingListController.getSpecificReadingLists));
router.delete('/deleteReadingList/:readingListId', auth(Object.values(roles)), asyncHandler(ReadingListController.deleteReadingList));




export default router;