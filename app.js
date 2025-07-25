const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path"); //setting up with ejs
 
//requiring listing from models folder
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");




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


//root route
app.get("/" , (req , res) => {
     res.send("Hi , I am a root");
});

//Index Route
app.get("/listings" , async(req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
});

//New Route
app.get("/listings/new" , (req , res) => {
     res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id" , async(req , res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id);

   res.render("listings/show.ejs" , {listing});
});

//Create Route
app.post("/listings" , async(req , res) => {
    //let {title , description ,image ,price , location , country } = req.body;
    //let listing = req.body.listing;

    const addListing = new Listing(req.body.listing);
    await addListing.save();

    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit" , async(req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);

   res.render("listings/edit.ejs" , {listing});
});

//Update Route
app.put("/listings/:id" , async (req , res)=> {
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
    
     res.redirect("/listings");
});

//Delete Route
app.delete("/listings/:id" , async(req, res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);

   res.redirect("/listings");
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
