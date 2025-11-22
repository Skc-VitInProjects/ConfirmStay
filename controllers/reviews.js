const Listing = require("../models/listing");
const Review = require("../models/review");

//Add Review Route callback function

module.exports.createReview = async(req, res)=> {
    console.log(req.params.id);  //to check whether id is accessible outside app.js (earlier not accessible , but with {mergeParams : true} it is accessible)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    //we will also save the author of the review
    newReview.author = req.user._id;
     
    listing.reviews.push(newReview); 

    await newReview.save();

    req.flash("success", "New Review Created !");
    await listing.save();

//     console.log("new review saved");
//     res.send("new review saved");

   res.redirect(`/listings/${listing._id}`);
}


//Delete Review Route callback function
module.exports.destroyReview = async(req, res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}}); //ab listing model ke andar delete kar denge
    await Review.findByIdAndDelete(reviewId);  //review model ke andar delete kar diya 
    
    req.flash("success" , "Review Deleted !");
    res.redirect(`/listings/${id}`);
}