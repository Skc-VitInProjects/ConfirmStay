const express = require("express");
const app = express();
const mongoose = require("mongoose");

//requiring listing from models folder
const Listing = require("./models/listing.js");

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


//root route
app.get("/" , (req , res) => {
     res.send("Hi , I am a root");
});

//
app.get("/listings" , async (req, res) => {
     let sampleListing = new Listing({
          title: "Malviya's Residence",
          description: "Near Airforce Station",
          price: 1200,
          location: "Calangute , Goa",
          country: "India"
     });

     await sampleListing.save();
     console.log( "Sample was saved");

     res.send("Sucessfull testing");
});

app.listen(8080 , () => {
     console.log("Server is listening to port 8080");
});