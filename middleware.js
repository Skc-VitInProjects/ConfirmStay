module.exports.isLoggedIn = (req, res , next) => {
  
  console.log(req.user);
  console.log(req.path , "..", req.originalUrl);

   if(!req.isAuthenticated()){ //if not authenticated

     req.session.redirectUrl = req.originalUrl; //once loggedin we redirect to our previous url
     req.flash("error", "you must be logged in !!");
     return res.redirect("/login");
  }

  next();
}

module.exports.saveRedirectUrl = (req , res , next) => {
  if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
}


