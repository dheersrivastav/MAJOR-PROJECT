const express=require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js')
const ExpressError=require('../utils/ExpressError.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview}=require("../middleware.js")
const reviewController=require('../controllers/reviews.js')


//Reviews :post routes
// Reviews : post routes
router.post('/', wrapAsync(reviewController.createReview))

//delete review routes
router.delete('/:reviewsId', wrapAsync(reviewController.destroyReview));
module.exports=router;