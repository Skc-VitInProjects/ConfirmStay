const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path"); //setting up with ejs


//-----used for the forms where we use methods like DELETE , which is not accepted by forms , so we override it
const methodOverride = require("method-override");

//Requiring ejs for the Express
const ejsMate = require("ejs-mate");

//requiring the express-session , connect-flash
const session = require("express-session");
const flash = require("connect-flash");


//routes ---> all the routes(create , update , show , delete)
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

//....................
//copy-pasted from mongoosejs.com
const MONGO_URL = "mongodb://127.0.0.1:27017/confirmStay"
async function main() {
     await mongoose.connect(MONGO_URL);
}

main()
     .then(() => {
          console.log("Connected to DB");
     }).catch((err) => {
          console.log(err);
     });
//................................................


//-----making use of all required frameworks
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
     secret: "mysupersecretcode",
     resave: false,
     saveUninitialized: true,
     cookie: {
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,   // weeks: 7days, 1day: 24hrs, 1hr: 60min, 1min: 60sec, 1sec: 1000millisec
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
     }
};


//.............................................................


//root route
app.get("/", (req, res) => {
     res.send("Hi , I am a root");
});

//we will use session and flash after the root route
app.use(session(sessionOptions));
app.use(flash());

//---Middleware for session, flash
app.use((req, res , next) => {
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     next();
});


//------Listings----------
//listing routes ---> create , update , show , delete route at routes/listing.js
app.use("/listings", listings);


//------Reviews------------
//review routes ---> create delete
app.use("/listings/:id/reviews", reviews);


//-----------------Middlewares---------


//"*"
// app.all("*"  , (req, res, next) => {
//      next(new ExpressError(404 , "Page not Found!"));
// });

app.use((err, req, res, next) => {
     let { statusCode = 500, message = "Something went Wrong !!!!" } = err;

     res.status(statusCode).render("error.ejs", { err });
     //res.send("Something went wrong");
     //res.status(statusCode).send(message);
});



app.listen(8080, () => {
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
