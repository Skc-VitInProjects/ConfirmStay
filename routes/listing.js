const express = require("express");
const router = express.Router();


//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring listing from models folder
const Listing = require("../models/listing.js");

//requiring controllers from controlers folder for the listing
const listingController = require("../controllers/listings.js");

//requiring multer to parse files(images,.etc)
const multer = require("multer");
const upload = multer({ dest: "uploads/"});

//-----middleware checks is user Login, owner, listing is validated
//requiring isLoggedIn --> to check if the user is loggedIn
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//-----------------------------------------------------------

//using router.route 
router.route("/")
     //Index Route
    .get(wrapAsync(listingController.index))

     //Create Route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    //Show Route
    .get(wrapAsync(listingController.showListing))
      
    //Update Route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;