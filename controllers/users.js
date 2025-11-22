const User = require("../models/user");


//---------Signup-----------
//New Route callback function
module.exports.renderSignupForm = (req , res) => {
   res.render("users/signup.ejs");
}


//Create Route callback function
module.exports.signupUser = async(req, res) => {
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
}


//-------------Login-------------------
//
module.exports.renderLoginForm = (req, res) => {
   res.render("users/login.ejs");
}

//
module.exports.loginUser = async(req,res)=>{
   
     req.flash("success","Welcome to ConfirmStay! You are logged in!");

     let redirectUrl = res.locals.redirectUrl || "/listings"; //agar redirect route tha , if not we will go to listings
     res.redirect(redirectUrl); 
}


//-----------Logout---------------------
module.exports.logoutUser = (req , res, next)=> {
     req.logout((error) => {
        if(error){
            next(error);
        }

        req.flash("success" , "You are logged out !");
        res.redirect("/listings");
     });
}
