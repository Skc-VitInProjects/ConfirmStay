const express = require("express");
const router = express.Router();
const passport = require("passport");

//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

//requiring user from models folder
const User = require("../models/user.js");

//requiring the redirect url from the middleware.js file
const { saveRedirectUrl } = require("../middleware.js");

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

    //jaise hi user signup hua --> woh automatically login rhega(login after signup)
    req.login(registeredUser , (error) => {
        if(error){
           return next(error);
        }
         console.log(registeredUser);
         req.flash("success", "Welcome to ConfirmStay!");
         res.redirect("/listings");
    }) ;
     
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
           saveRedirectUrl, //check middleware.js
           passport.authenticate("local" , {
               failureRedirect: "/login" ,
               failureFlash: true
           }), 
           async(req,res)=>{
   
     req.flash("success","Welcome to ConfirmStay! You are logged in!");

     let redirectUrl = res.locals.redirectUrl || "/listings"; //agar redirect route tha , if not we will go to listings
     res.redirect(redirectUrl); 
});


//----------------logout---------------
router.get("/logout" , (req , res, next)=> {
     req.logout((error) => {
        if(error){
            next(error);
        }

        req.flash("success" , "You are logged out !");
        res.redirect("/listings");
     });
});


module.exports = router;