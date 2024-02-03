import { globalErrorHandler } from '../Services/errorHandling.js'

import AuthRouter from './Auth/auth.router.js'
import UserRouter from './User/user.router.js'
import NovelRouter from './Novel/novel.router.js'
import CommentRouter from './Comment/comment.router.js'
import PartRouter from './Part/part.router.js'
import ReadingListRouter from './ReadingList/readingList.router.js'


import ConnectDB from '../../DB/connection.js';

const initApp=(app,express)=>{

app.use(express.json());

app.get('/',(req,res)=>{
    return res.json('welcome...')
});
ConnectDB();
app.use('/auth',AuthRouter);
app.use('/user',UserRouter);
app.use('/novel',NovelRouter);
app.use('/comment',CommentRouter);
app.use('/part',PartRouter);
app.use('/readingList',ReadingListRouter);

app.get('*',(req,res)=>{
    return res.json({message:'page not found'})
});
app.use(globalErrorHandler);
}


export default initApp