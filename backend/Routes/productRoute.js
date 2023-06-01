const express=require('express');
const { getAllProduct, createMyProduct, updateMyProduct, deleteMyProduct, getOneProduct, createProductReview, getProductReview, deleteReview } = require('../controllers/productController');
const {isAuthenticated,authorizeRoles}=require('../middleware/auth')
const router=express.Router();

router.route('/products').get(getAllProduct)
router.route('/admin/products/new').post(isAuthenticated,authorizeRoles("admin"),createMyProduct)
router.route('/admin/products/:id')
.put(isAuthenticated,authorizeRoles("admin"),updateMyProduct)
.delete(isAuthenticated,authorizeRoles("admin"),deleteMyProduct)

router.route("/product/:id").get(getOneProduct);

router.route("/review").put(isAuthenticated,createProductReview)

router.route("/reviews").get(getProductReview).delete(isAuthenticated,deleteReview)
module.exports=router