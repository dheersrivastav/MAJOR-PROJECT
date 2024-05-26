//we can also add this on each lsting routes new,edit
//but we make mlware file and use this on 

const {listingSchema,reviewSchema}=require('./schema.js')
const ExpressError=require('./utils/ExpressError.js');


const Listing=require("./models/listing")
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error",'You must be logged in to create listing')
        return res.redirect('/login')
       }
       next();
}

 module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
 }

  module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id) ){
      req.flash("error","You are not owner of this listing");
     res.redirect(`/listings/${id}`);
    
  }
next();
}


module.exports.  validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body); 
    console.log(error);
  
    if( error){
     throw new ExpressError(400,error)
    }else{
      next();  
    }
  } 


  module.exports. validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body); 
    console.log(error);
  
    if( error){
     throw new ExpressError(400,error)
    }else{
      next();  
    }
  } 