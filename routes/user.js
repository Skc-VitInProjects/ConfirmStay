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
router.route("/signup")
    //New Route
    .get(userController.renderSignupForm)

    //Create Route
    .post(wrapAsync(userController.signupUser));



//--------------Login---------------
router.route("/login")
    //
    .get(userController.renderLoginForm)

   //
   .post(
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