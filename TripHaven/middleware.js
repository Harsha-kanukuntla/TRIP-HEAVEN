const Review = require("./models/reviews");
const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You Must Be Logged In To Create Listings")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    try {
        let review = await Review.findById(reviewId).populate('author');
        
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }
        
        if (!review.author || !review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", err);
        req.flash("error", "An error occurred while verifying review ownership");
        res.redirect(`/listings/${id}`);
    }
};