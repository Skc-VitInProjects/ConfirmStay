const Listing = require("../models/listing");

//Index Route callBack function
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}


//New Route callback function
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");

}


//Show Route callback function
module.exports.showListing = async (req, res) => {
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

}


//Create Route call Back function
module.exports.createListing = async (req, res, next) => {
  //let {title , description ,image ,price , location , country } = req.body;
  //let listing = req.body.listing;

  //try{

  //     if(!req.body.listing){
  //        throw new ExpressError(400 , "Bad Request : Send valid data");
  //     }

  let url = req.file.path;  //cloudinary path where image is getting saved
  let filename = req.file.filename; 

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
  
  addListing.image = {url , filename};
  
  await addListing.save();

  req.flash("success", "New Listing Created !"); //listing create hone ke baad flash message bhejenge

  res.redirect("/listings");
  //} catch (err){
  // next(err);  //if something is wrong , it will call the next error handler 
  //}
}

//Edit Route callback function
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist !");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }

}

//Update Route callBack function
module.exports.updateListing = async (req, res) => {
  // if(!req.body.listing){
  //    throw new ExpressError(400 , "Send valid data");
  // }

  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 
  if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url , filename};
    await listing.save();
  }
  
  req.flash("success", "Listing Updated !")
  res.redirect(`/listings/${id}`);
}

//Delete Route callback function
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
}