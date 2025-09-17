const express = require("express");
const router = express.Router();


//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring listing from models folder
const Listing = require("../models/listing.js");

//-----middleware checks is user Login, owner, listing is validated
//requiring isLoggedIn --> to check if the user is loggedIn
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//-----------------------------------------------------------
//Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");

});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
         path: "author" 
        }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }

}));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  //let {title , description ,image ,price , location , country } = req.body;
  //let listing = req.body.listing;

  //try{

  //     if(!req.body.listing){
  //        throw new ExpressError(400 , "Bad Request : Send valid data");
  //     }


  const addListing = new Listing(req.body.listing);

  //     if(!addListing.description){
  //       throw new ExpressError(400 , "Description is missing");
  //     }

  //     if(!addListing.title){
  //       throw new ExpressError(400 , "Title is missing");
  //     }

  //     if(!addListing.location){
  //       throw new ExpressError(400 , "Location is missing");
  //     }

  //     if(!addListing.country){
  //      throw new ExpressError(400 , "Country is missing");
  //     }

  addListing.owner = req.user._id;

  await addListing.save();

  req.flash("success", "New Listing Created !"); //listing create hone ke baad flash message bhejenge

  res.redirect("/listings");
  //} catch (err){
  // next(err);  //if something is wrong , it will call the next error handler 
  //}
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist !");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }

}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  // if(!req.body.listing){
  //    throw new ExpressError(400 , "Send valid data");
  // }

  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing Updated !")
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
}));

module.exports = router;