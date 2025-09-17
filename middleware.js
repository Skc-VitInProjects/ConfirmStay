const Listing = require("./models/listing"); //to check isOwner
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");  //Schema Validation (Server-side validation)


//---------------middlewares-------------
module.exports.isLoggedIn = (req, res , next) => {
  
  console.log(req.user);
  console.log(req.path , "..", req.originalUrl);

   if(!req.isAuthenticated()){ //if not authenticated

     req.session.redirectUrl = req.originalUrl; //once loggedin we redirect to our previous url
     req.flash("error", "you must be logged in !!");
     return res.redirect("/login");
  }

  next();
}

module.exports.saveRedirectUrl = (req , res , next) => {
  if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
}

//Middleware for Schema Validation (Server Side Validation)
module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  // console.log(result);

  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//Middleware for Schema Validation (Server Side Validation)
module.exports.validateReview = (req , res , next) => {
     let result = reviewSchema.validate(req.body);

     if(result.error){
          let errMsg = result.error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
     }else{
          next();
     }
}

//Authorization for listings
module.exports.isOwner = async(req , res , next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){ //authorization setup 
     req.flash("error" , "Permission denied!");
     return res.redirect(`/listings/${id}`);
  }

  next();
}
