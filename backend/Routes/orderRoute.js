const express=require("express");
const router=express.Router();

const {isAuthenticated, authorizeRoles}=require('../middleware/auth');
const { createOrder, getSingleorder, myOrder, myAllOrder, updateOrder, deleteMyOrder } = require("../controllers/orderController");

router.route('/order/new').post(isAuthenticated,createOrder)

router.route('/order/:id').get(isAuthenticated,getSingleorder)

router.route('/order/me').get(isAuthenticated,myOrder)

router.route('/admin/orders').get(isAuthenticated,authorizeRoles('admin'),myAllOrder)

router.route('/admin/order/:id').put(isAuthenticated,authorizeRoles('admin'),updateOrder).delete(isAuthenticated,authorizeRoles('admin'),deleteMyOrder)

module.exports=router