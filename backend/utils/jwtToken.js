// // //create token and saving cookie

const sendToken=(user,statuscode,res)=>{

    const token= user.getJWTToken();

    //option for cookie
    const options={
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*100
        ),
        httpOnly:true,
    };
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        user,
        token,
    })
};
module.exports=sendToken;