const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const Review= require("../models/review");
const Listing=require('../models/listing');

const reviewsController = require("../controllers/review.js");


const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
     if (error) {
       let errorMsg= error.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errorMsg);
    } else{
        next();
    }
};

 // Reviews 
  //Post Route
  router.post("/",validateReview, wrapAsync( reviewsController.createReview));
  
  //delete review route
router.delete("/:reviewId", wrapAsync( reviewsController.destroyReview
  ));

  module.exports = router;