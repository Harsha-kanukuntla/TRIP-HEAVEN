const express=require('express')
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const wrapAsync=require("../utils/wrapAsync.js")
const Listing = require("../models/listing");
const { reviewSchema , listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn,isReviewAuthor}=require('../middleware')
const reviewController=require("../controllers/reviews.js")


const validationReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((e) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}


//Reviews
//post route
router.post("/",isLoggedIn,validationReviews,wrapAsync(reviewController.creteReview)
)

//delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview))

module.exports=router