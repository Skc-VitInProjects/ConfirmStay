const express = require("express");
const router = express.Router();


//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring listing from models folder
const Listing = require("../models/listing.js");

//requiring controllers from controlers folder for the listing
const listingController = require("../controllers/listings.js");


//-----middleware checks is user Login, owner, listing is validated
//requiring isLoggedIn --> to check if the user is loggedIn
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//-----------------------------------------------------------
//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;