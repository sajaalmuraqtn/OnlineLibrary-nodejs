import ReadingListModel from "../../../../DB/model/readingList.model.js";

export const createReadingList=async(req,res,next)=>{
    const name = req.body.name.toLowerCase();
    if (await ReadingListModel.findOne({ name,createdBy:req.user._id }).select('name')) {
        return next(new Error("name already exist", { cause: 409 }));
    }
     req.body.createdBy=req.user._id;
     req.body.novels=[];
    const ReadingList=await ReadingListModel.create(req.body);
    return res.status(201).json({message:'success',ReadingList});

}

export const removeItem=async(req,res,next)=>{
    const {productId}=req.body;
   const cart=await CartModel.updateOne({userId:req.user._id},{$pull:
    {
     products:{productId}
    }})
    return res.status(201).json({message:'success',cart});
}