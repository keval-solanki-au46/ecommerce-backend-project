const myUser=require('../models/userModel');
const ErrorHandler = require('../utils/errorhandles');
const sendToken = require('../utils/jwtToken');
const  sendEmail  = require("../utils/sendEmail");
const crypto=require('crypto')

//register user 
exports.myregisterUser=async(req,res)=>{

    const {name,email,password}=req.body;

     const user=await myUser.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profileurl"
        }
    });

  sendToken(user,201,res)
};

// //login user
exports.myloginUser=async(req,res)=>{
  
    const {email,password}=req.body;
    console.log(email)
    console.log(password)
    //checking if user given password and email both
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Please Enter Email and Password",
        })
    }
    const user = await myUser.findOne({ email }).select("+password");

    
    if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch)
    if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect email or password",
        });
      }
    
      sendToken(user,200,res)
    
}   
// //logout
exports.logoutUser=async(req,res)=>{
  try {
    res
      .status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
        success: true,
        message: "Logged out",
      });
  }catch(error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
 
// }
// //update password

exports.updatePassword = async (req, res,next) => {
 
    const user = await myUser.findById(req.user._id).select("+password");
    
    
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)


    if (!isPasswordMatched) {
      return next(new ErrorHandler("old password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.comfirmPassword){
      return next(new ErrorHandler("password does not match",400))
    }
    user.password=req.body.newPassword;

    await user.save();
    
    sendToken(user,200,res)
};
// //Forgot password


exports.forgotPassword = async (req, res) => {
 
    const user = await myUser.findOne({ email: req.body.email });
    console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.passwordToken();
    console.log(resetToken)

    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  
};
// };
// //reset password

exports.resetPassword = async (req, res) => {
  
    // const resetPasswordToken = crypto
    //   .createHash("sha256")
    //   .update(req.params.token)
    //   .digest("hex");
    // //console.log(resetPasswordToken)
    // const user = await myUser.findOne({
    //   resetPasswordToken,
    //   resetPasswordExpire: { $gt: Date.now() },
    // });

    const user = await myUser.findOne({ _id : req.params.token})
    
    console.log(user)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    if(req.body.password !== req.body.comfirmPassword){
      return res.status(400).json({
        success: false,
        message: "Password does not ",
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
   
    await user.save();

    sendToken(user,200,res)
  
  
};

// //get product details

exports.getUserDetails = async (req, res) => {

  const user=await myUser.findById(req.user.id);

  res.status(200).json({
    success:true,
    user,
  })

}

//update user profile - admin
exports.updateUserprofile=async(req,res)=>{

  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
  }
  //we will add cloudinary later
  const user=await myUser.findByIdAndUpdate(req.user.id,newUserData,{

    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  res.status(200).json({
    success:true,
  })
}

// //get all users
exports.getAllUser=async(req,res)=>{

  const user=await myUser.find();

  res.status(200).json({
    success:true,
    user,
  })
}
// //get single users (admin)
exports.getSingleUser=async(req,res)=>{

  const user=await myUser.findById(req.params.id);

  if(!user){

    return res.status(404).json({
      success: false,
      message: "User does not exit with id "+req.params.id,
    });

  }

  res.status(200).json({
    success:true,
    user,
  })
}

//Update user role --admin

exports.updateUserRole=async(req,res)=>{

  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
  }
 
  const user=await myUser.findByIdAndUpdate(req.params.id,newUserData,{

    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  res.status(200).json({
    success:true,
  })
}

//Delete user -admin

exports.deleteUser=async(req,res)=>{

  const user=await myUser.findOneAndRemove(req.params.id)

  if(!user){
     
    return res.status(404).json({
      success: false,
      message: "User does not exit with id "+req.params.id,
    });
  }

  res.status(200).json({
    success:true,
    message:"user deleted successfull"
  })

  // const { userId } = req.params;

  // try {
  //   // Find the user by their ID and remove it from the database
  //   await User.findByIdAndRemove(userId);

  //   res.json({ message: 'User removed successfully.' });
  // } catch (error) {
  //   res.status(500).json({ message: 'Error removing the user.' });
  // }
}


// //update User password
// exports.updateUserPassword=async(req,res)=>{

//   const user=await myUser.findById(req.user.id).select("+password");
//   console.log(user)

//   const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

  

//   if(!isPasswordMatched){
//     return res.status(401).json({
//       success: false,
//       message: "Old password is incorrect ",
    
//   })

  
// }
//   if(!req.body.newPassword !== req.body.comfirmPassword){

//     return res.status(400).json({
//       success: false,
//       message: "password does not match ",
//   })
// }
// user.password=req.body.newPassword;

// await user.save();

// sendToken(user,200,res)
// }