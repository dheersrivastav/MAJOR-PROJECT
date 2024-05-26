
const Listing=require('../models/listing')
const Review= require('../models/review')

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // newReview.listing = listing;
    await newReview.save();    // Saving the new review
    listing.reviews.push(newReview._id);
    await listing.save();    // Saving the updated listing with the new review
    req.flash('success'," Review created!")
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let { id, reviewsId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } });
    await Review.findByIdAndDelete(reviewsId);
    req.flash('success'," Review deleted!")
    res.redirect(`/listings/${id}`);
  };
  