const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path"); //setting up with ejs
 
//requiring listing from models folder
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

//Error handling wrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

//Schema Validation (Server-side validation)
const {listingSchema , reviewSchema} = require("./schema.js");


//....................
//copy-pasted from mongoosejs.com
const MONGO_URL = "mongodb://127.0.0.1:27017/confirmStay"
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
   .then(() => {
     console.log("Connected to DB");
}).catch((err) => {
     console.log(err);
});
//.....................



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

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

const validateReview = (req , res , next) => {
     let result = reviewSchema.validate(req.body);

     if(result.error){
          let errMsg = result.error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
     }else{
          next();
     }
}

//root route
app.get("/" , (req , res) => {
     res.send("Hi , I am a root");
});

//Index Route
app.get("/listings" , wrapAsync(async(req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}));

//New Route
app.get("/listings/new" , (req , res) => {
     res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id" , wrapAsync(async(req , res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");

   res.render("listings/show.ejs" , {listing});
}));

//Create Route
app.post("/listings" , validateListing , wrapAsync(async(req , res , next) => {
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
app.get("/listings/:id/edit" , wrapAsync(async(req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);

   res.render("listings/edit.ejs" , {listing});
}));

//Update Route
app.put("/listings/:id" , validateListing ,wrapAsync(async (req , res)=> {
     // if(!req.body.listing){
     //    throw new ExpressError(400 , "Send valid data");
     // }

     let {id} = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
    
     res.redirect("/listings");
}));

//Delete Route
app.delete("/listings/:id" , wrapAsync(async(req, res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);

   res.redirect("/listings");
}));

//-----------Reviews------------
//Add Review
app.post("/listings/:id/reviews" , validateReview , wrapAsync(async(req, res)=> {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview); 

    await newReview.save();
    await listing.save();

//     console.log("new review saved");
//     res.send("new review saved");

   res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
app.delete ("/listings/:id/reviews/:reviewId" , wrapAsync(async(req, res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}}); //ab listing model ke andar delete kar denge
    await Review.findByIdAndDelete(reviewId);  //review model ke andar delete kar diya 

    res.redirect(`/listings/${id}`);
}));





//Middlewares
//"*"
// app.all("*"  , (req, res, next) => {
//      next(new ExpressError(404 , "Page not Found!"));
// });

app.use((err, req, res, next) => {
     let {statusCode = 500 , message = "Something went Wrong !!!!"} = err;

     res.status(statusCode).render("error.ejs", {err});
    //res.send("Something went wrong");
     //res.status(statusCode).send(message);
});



app.listen(8080 , () => {
     console.log("Server is listening to port 8080");
});





//
// app.get("/listings" , async (req, res) => {
//      let sampleListing = new Listing({
//           title: "Malviya's Residence",
//           description: "Near Airforce Station",
//           price: 1200,
//           location: "Calangute , Goa",
//           country: "India"
//      });

//      await sampleListing.save();
//      console.log( "Sample was saved");

//      res.send("Sucessfull testing");
// });
