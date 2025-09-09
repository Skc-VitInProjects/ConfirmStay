const express = require("express");
const router = express.Router({mergeParams: true});

//Error handling wrapAsync function, custom expressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


//Schema Validation (Server-side validation)
const {listingSchema , reviewSchema} = require("../schema.js");


//Middleware for Schema Validation (Server Side Validation)
const validateReview = (req , res , next) => {
     let result = reviewSchema.validate(req.body);

     if(result.error){
          let errMsg = result.error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
     }else{
          next();
     }
}

//requiring review model from models folder
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



//Add Review
router.post("/" , validateReview , wrapAsync(async(req, res)=> {
    console.log(req.params.id);  //to check whether id is accessible outside app.js (earlier not accessible , but with {mergeParams : true} it is accessible)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview); 

    await newReview.save();

    req.flash("success", "New Review Created !");
    await listing.save();

//     console.log("new review saved");
//     res.send("new review saved");

   res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete ("/:reviewId" , wrapAsync(async(req, res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}}); //ab listing model ke andar delete kar denge
    await Review.findByIdAndDelete(reviewId);  //review model ke andar delete kar diya 
    
    req.flash("success" , "Review Deleted !");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;


