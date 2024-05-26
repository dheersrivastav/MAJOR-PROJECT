const express=require('express')
const router=express.Router()
const wrapAsync=require('../utils/wrapAsync.js')
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner,validateListing}=require('../middleware.js')
//for making structure code we create routes

const listingController=require('../controllers/listing.js')

const multer =require('multer')
const{storage}=require("../cloudConfig.js")
const upload= multer({storage})

router.route("/").get(wrapAsync(listingController.index))
.post(
isLoggedIn,   
upload.single('listing[image]'),
validateListing,
wrapAsync(listingController.createListing))


//New Routess
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
isLoggedIn, 
isOwner,
upload.single('listing[image]'),
validateListing,
  wrapAsync(listingController.updateListing))
  .delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))
  
 
//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))
  



module.exports=router;