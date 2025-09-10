const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//Schema
//passport automatically username , password ka schema bna deta ha
const userSchema = new Schema ({
     email: { 
          type: String,
          required: true
     }
   
});

// Apply the passport-local-mongoose plugin to userSchema
userSchema.plugin(passportLocalMongoose);
 
// Create and export the User model
module.exports = mongoose.model("User" , userSchema);
