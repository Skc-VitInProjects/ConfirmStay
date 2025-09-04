const express = require("express");
const router = express.Router();


//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


//Schema Validation (Server-side validation)
const {listingSchema , reviewSchema} = require("../schema.js");


//Middleware for Schema Validation (Server Side Validation)
const validateListing = (req , res , next) => {
    let result = listingSchema.validate(req.body);
    // console.log(result);

    if(result.error){
      let errMsg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(400 , errMsg);
    }else{
      next();
    }
}

//requiring listing from models folder
const Listing = require("../models/listing.js");



//Index Route
router.get("/" , wrapAsync(async(req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}));

//New Route
router.get("/new" , (req , res) => {
     res.render("listings/new.ejs");
});

//Show Route
router.get("/:id" , wrapAsync(async(req , res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");

   res.render("listings/show.ejs" , {listing});
}));

//Create Route
router.post("/" , validateListing , wrapAsync(async(req , res , next) => {
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

    await addListing.save();
    res.redirect("/listings");
  //} catch (err){
     // next(err);  //if something is wrong , it will call the next error handler 
  //}
}));

//Edit Route
router.get("/:id/edit" , wrapAsync(async(req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);

   res.render("listings/edit.ejs" , {listing});
}));

//Update Route
router.put("/:id" , validateListing ,wrapAsync(async (req , res)=> {
     // if(!req.body.listing){
     //    throw new ExpressError(400 , "Send valid data");
     // }

     let {id} = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
    
     res.redirect("/listings");
}));

//Delete Route
router.delete("/:id" , wrapAsync(async(req, res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);

   res.redirect("/listings");
}));

module.exports = router;