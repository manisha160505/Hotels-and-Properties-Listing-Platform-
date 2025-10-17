const Listing= require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
      res.render("listings/new.ejs");
};
  
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    // try{
        // if (!req.body.listing) {
        //     throw new ExpressError(400, "Invalid Listing Data");
        // }

        const newListing = new Listing(req.body.listing);
        // if(!newListing.title){
        //     throw new ExpressError(400, "Title is missing");
        // }
        // if(!newListing.description){
        //   throw new ExpressError(400, "Description is missing");
        // }
        // if(!newListing.location){
        //   throw new ExpressError(400, "Location is missing");
        // }
        
        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if (result.error) {
        //    throw new ExpressError(400, result.error);
        // } 

        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    // }
    // catch(err){
    //     next(err);
    // }
    

}

module.exports.renderEditForm = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        // return next(new ExpressError(400, "Listing not found"));
        req.flash("error", "Listing not found");
       res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  }

module.exports.updateListing = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Invalid Listing Data");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  }