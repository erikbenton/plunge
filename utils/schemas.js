const Joi = require("joi");

module.exports.diveSpotSchema = Joi.object({
  diveSpot: Joi.object({
    title: Joi.string().required().min(3),
    depth: Joi.number().required().min(0),
    //images: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    longitude: Joi.number(),
    latitude: Joi.number()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
});