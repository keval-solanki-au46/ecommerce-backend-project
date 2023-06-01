const Order=require('../models/orderModel');
const myProduct=require('../models/productModel');
const ErrorHandler = require('../utils/errorhandles');

//create new order

exports.createOrder=async(req,res,next)=>{

    const{
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;

    const order=await Order.create({

        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    })
    res.status(201).json({
        success:true,
        order,
    })
}
//get single order

exports.getSingleorder=async(req,res)=>{

    const order=await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return res.status(404).json({
            success:false,
            message:"order not found with this Id"
    })
    }
    res.status(200).json({
        success:true,
        order,
    })
}

//get logged in user orders

exports.myOrder=async(req,res)=>{

    const order=await Order.find({user:req.user._id});
    console.log(order)
    
    res.status(200).json({
        success:true,
        order,
    })
}

//get all orders

exports.myAllOrder=async(req,res)=>{

    const order=await Order.find();
   
    let totalAmount=0;

    order.forEach(order => {
        totalAmount +=order.totalPrice;
    });
    
    res.status(200).json({
        success:true,
        totalAmount,
        order,
    })
}

//update order status --admin

exports.updateOrder=async(req,res)=>{

    const order=await Order.findById(req.params.id);
    if(!order){
        return res.status(404).json({
            success:false,
            message:"order not found with this Id"
    })}
  // console.log(order)
    if(order.orderStatus==="Delivered"){

         return res.status(400).json({
            success:false,
            message:"you have already delivered this order"
         })
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity)
    });

    order.orderStatus=req.body.status;
   
    if(req.body.status==="Delovered"){
        order.deliveredAt=Date.now();
    }
    
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
       
    })
}

async function updateStock(id,quantity){

    const product=await myProduct.findById(id);

    product.Stock=product.Stock-quantity;

    await product.save({validateBeforeSave:false})
}

//delete orders --admin

exports.deleteMyOrder=async(req,res)=>{

    const order=await Order.findByIdAndRemove(req.params.id);
   
   

    if(!order){
        return res.status(404).json({
            success:false,
            message:"order not found with this Id"
    })}

    res.status(200).json({
        success:true,
      
    })
}