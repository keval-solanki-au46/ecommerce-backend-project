const ErrorHander=require('../utils/errorhandles')

module.exports=(err,req,res,next)=>{

    err.statusCode=err.statusCode || 500;
    err.message=err.message || 'Internal Server Error';

    // //wrong mongodb id error
    // if(err.name==="CastError"){
    //     const message=`Resource not found. Invalid:${err.path}`;
    //     err=new ErrorHander(message,400)
    // }

    //mongoose duplicate key error

    if(err.code===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHander(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        error:err,
    })
}