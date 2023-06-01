const myProducts=require('../models/productModel');
const ApiFeacture = require('../utils/apifeacture');

//create product --admin

exports.createMyProduct=async(req,res,next)=>{

    req.body.user=req.user.id;

    const product=await myProducts.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
}

//get all product
exports.getAllProduct=async(req,res)=>{

    const reasultperpage=8;
    const productCount=await myProducts.countDocuments();
    
    const apifeacture=new ApiFeacture(myProducts.find(),req.query).search().filter().pagination(reasultperpage)
    const product=await apifeacture.query;
    res.status(200).json({success:true,
        product,
    productCount,})
}
//get product details
exports.getOneProduct=async(req,res,next)=>{
  
    let product=await myProducts.findById(req.params.id)
    
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
     
   })}
   res.status(200).json({
    success:true,
    product,
    productcount,
})
}

//update product -- admin
exports.updateMyProduct=async(req,res,next)=>{

    let product=await myProducts.findById(req.params.id)

    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    product=await myProducts.findByIdAndUpdate(req.params.id,req.body,{new:true,
    runValidators:true,
    useFindAndModify:false
})
    res.status(200).json({
        success:true,
        product
    })

}

//delete product -admin
exports.deleteMyProduct=async(req,res,next)=>{
    
    const product=await myProducts.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found"
     
   })}
    try{
        const result=await myProducts.findByIdAndDelete(product)
        res.status(200).json({
            success:true,
            result,
            message:"Delete successfully"
        })
    }catch(error){
        console.log(error.message)
    }
}

//create new review or update the review

exports.createProductReview=async(req,res)=>{

    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product=await myProducts.findById(productId);
    console.log(product)
    const isreviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
    if(isreviewed){
            product.reviews.forEach(rev => {

                if(rev.user.toString()===req.user._id.toString())
                (rev.rating=rating),(rev.comment=comment)
            });
    }
    else{
        product.reviews.push(review)
        product.numberOfreviews=product.reviews.length;
    }

    let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
    })
    product.ratings=avg/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })
}

//get all reviews of a product


exports.getProductReview=async(req,res)=>{

    const product=await myProducts.findById(req.query.id);

    if(!product){

        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }
    res.status(200).json({
        success:true,
        review:product.reviews
    })


}

//Delete review
exports.deleteReview=async(req,res)=>{

    const product=await myProducts.findById(req.query.productId);

    if(!product){

        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }

    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())

    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;
    })
   const ratings=avg/reviews.length;

   const numberOfreviews=reviews.length

   await myProducts.findByIdAndUpdate(req.query.productId,{
    reviews,ratings,numberOfreviews}
    ,
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
        review:product.reviews
    })

}