const myUser = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ErrorHander = require("../utils/errorhandles");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await myUser.findById(decoded.id);

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.authorizeRoles=(...roles)=>{

    return(req,res,next)=>{

        if(!roles.includes(req.user.role)){

         return next( new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
         )
        }
        next();
        
    }
}
