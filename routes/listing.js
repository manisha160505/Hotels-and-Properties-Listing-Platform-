const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const Listing=require('../models/listing');
const flash = require("connect-flash");
const listingsController = require("../controllers/listing.js");

const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
     if (error) {
       let errorMsg= err.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errorMsg);
    } else{
        next();
    }
};


router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(validateListing, wrapAsync(listingsController.createListing));



//Index Route
// router.get("/", wrapAsync(listingsController.index));
//new Route
router.get("/new", listingsController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(validateListing, listingsController.updateListing);


  //Show Route
// router.get("/:id", wrapAsync(listingsController.showListing));
//create route
// router.post("/",validateListing, wrapAsync(listingsController.createListing));

//edit route
router.get("/:id/edit", wrapAsync(listingsController.renderEditForm));

  //Update Route
// router.put("/:id",validateListing, listingsController.updateListing);

  //Delete Route
router.delete("/:id", listingsController.destroyListing);

module.exports = router;
