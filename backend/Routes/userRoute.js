const express=require('express');
const router=express.Router();
const {myregisterUser, myloginUser, logoutUser, forgotPassword,updatePassword, getUserDetails, resetPassword, updateUserprofile, getAllUser, getSingleUser, updateUserPassword, updateUserRole, deleteUser}=require('../controllers/userController')

const {isAuthenticated, authorizeRoles}=require('../middleware/auth')

router.route('/register').post(myregisterUser);

router.route('/login').post(myloginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/update').put(isAuthenticated,updatePassword);

router.route("/password/reset/:token").put(resetPassword);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticated,getUserDetails);

router.route('/me/update').put(isAuthenticated,updateUserprofile);

router.route('/admin/users').get(isAuthenticated,authorizeRoles("admin"),getAllUser);

router.route('/admin/user/:id')
.get(isAuthenticated,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticated,authorizeRoles('admin'),updateUserRole)
.delete(isAuthenticated,authorizeRoles('admin'),deleteUser);

// router.route('/password/update').put(isAuthenticated,updateUserPassword)
module.exports=router;