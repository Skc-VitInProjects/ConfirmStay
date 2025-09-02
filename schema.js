const Joi = require("joi");

//listing Schema used for validation (server-side)
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
       title: Joi.string().required(),
       description: Joi.string().required(),
       location: Joi.string().required(),
       country : Joi.string().required(),
       price: Joi.number().required().min(0),
       image : Joi.string().allow("" ,null)
       
    }).required()
});


//review schema used for validation (server-side)
module.exports.reviewSchema = Joi.object({
   review: Joi.object({
       rating: Joi.number().required(),
       comment: Joi.string().required()
   }).required()
});
