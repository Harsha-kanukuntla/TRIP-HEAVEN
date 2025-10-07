const express=require('express')
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema , listingSchema} = require('../schema.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing }=require("../middleware.js");
const path = require('path');
const listingController=require('../controllers/listings.js')
const {storage}=require('../cloudConfig.js')
const multer = require('multer');
const upload = multer({ storage});


const validationReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((e) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}


router.route('/')
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
upload.single('listing[image]'),
validateListing ,
wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/:id", wrapAsync(listingController.showListing))


router.get("/:id/edit",isLoggedIn,listingController.listingEdit);

// Update route with file upload handling
router.put("/:id", isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Debug routes
router.get('/debug-listings', async (req, res) => {
    const listings = await Listing.find({});
    res.json(listings);
})


module.exports=router