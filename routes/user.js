const express = require("express");
const router = express.Router();
const passport = require("passport");

//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring user from models folder
const User = require("../models/user.js");

//-----------Signup----------------------
//New Route
router.get("/signup" , (req , res) => {
   res.render("users/signup.ejs");
});

//Create Route
router.post("/signup" , wrapAsync(async(req, res) => {
    try{
     let {username, email, password} = req.body;
    
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser , password);

    console.log(registeredUser);
    req.flash("success", "Welcome to ConfirmStay!");

    res.redirect("/listings");  
    }catch(err){
     req.flash("error", err.message);
     res.redirect("/signup");
    }
}));

//--------------Login---------------
//
router.get("/login" , (req, res) => {
   res.render("users/login.ejs");
});

//
router.post("/login",
           passport.authenticate("local" , {
               failureRedirect: "/login" ,
               failureFlash: true
           }), 
           async(req,res)=>{
   
     req.flash("success","Welcome to ConfirmStay! You are logged in!");
     res.redirect("/listings");
});

module.exports = router;