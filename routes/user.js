const express = require("express");
const router = express.Router();
const passport = require("passport");

//Error handling wrapAsync function , custom ExpressError
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


//requiring controllers for user
const userController = require("../controllers/users.js");

//requiring user from models folder
const User = require("../models/user.js");

//requiring the redirect url from the middleware.js file
const { saveRedirectUrl } = require("../middleware.js");




//-----------Signup----------------------
//New Route
router.get("/signup" , userController.renderSignupForm);

//Create Route
router.post("/signup" , wrapAsync(userController.signupUser));



//--------------Login---------------
//
router.get("/login" , userController.renderLoginForm);

//
router.post("/login",
           saveRedirectUrl, //check middleware.js
           passport.authenticate("local" , {
               failureRedirect: "/login" ,
               failureFlash: true
           }), 
           userController.loginUser
         );


//----------------logout---------------
router.get("/logout" , userController.logoutUser); 


module.exports = router;