const express = require("express");
const router = express.Router({mergeParams: true});

//Error handling wrapAsync function, custom expressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring the controllers for the review route
const reviewController = require("../controllers/reviews.js");

//requiring review model from models folder
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//middlewares 
const {validateReview , isLoggedIn, isAuthor} = require("../middleware.js");


//.......................................................
//Add Review
router.post("/" ,isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

//Delete Route
router.delete ("/:reviewId" ,isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;


