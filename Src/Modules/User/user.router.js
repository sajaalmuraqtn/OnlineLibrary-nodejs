import { Router } from "express";
import * as UserController from './Controller/user.controller.js'
import ReadingListRouter from '../ReadingList/readingList.router.js'
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth, roles } from "../../Middleware/auth.js";

const router = Router({ mergeParams: true });


router.use('/readingList', ReadingListRouter);
router.get('/profile', auth(Object.values(roles)), asyncHandler(UserController.profile)) ;
 
export default router;