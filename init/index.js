const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//....................
//copy-pasted from mongoosejs.com
const MONGO_URL = "mongodb://127.0.0.1:27017/confirmStay"

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
   .then(() => {
     console.log("Connected to DB");
})
   .catch((err) => {
     console.log(err);
});
//.....................

const initDB = async () => {
     await Listing.deleteMany({});  //pehle ka sample data delete
     await Listing.insertMany(initData.data);  //data.js k array of data insert
     console.log("data was initialized");
};

initDB();