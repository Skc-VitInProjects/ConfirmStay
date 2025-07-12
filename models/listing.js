const mongoose = require("mongoose");

//isse baar baar mongoose.Schema nhi likna padega , har schema ke liye
const Schema = mongoose.Schema;

//Schema
const listingSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: String,
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1611511450282-af4421e9e05d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
      set: (v) => v === "" 
        ? "https://images.unsplash.com/photo-1611511450282-af4421e9e05d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        : v 
    },
    price: Number,
    location: String,
    country: String
});

//models
const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;