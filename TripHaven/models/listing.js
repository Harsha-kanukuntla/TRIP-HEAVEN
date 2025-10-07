const mongoose=require("mongoose")
const Review = require("./reviews");
const reveiw=require("./reviews")
const { string } = require("joi");
const Schema=mongoose.Schema

const listeningSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image: {
    url: {
      type: String,
      default: "https://media.istockphoto.com/id/610041376/photo/beautiful-sunrise-over-the-sea.jpg?s=612x612&w=0&k=20&c=R3Tcc6HKc1ixPrBc7qXvXFCicm8jLMMlT99MfmchLNA=",
      set: (v) => v === "" ? "https://media.istockphoto.com/id/610041376/photo/beautiful-sunrise-over-the-sea.jpg?s=612x612&w=0&k=20&c=R3Tcc6HKc1ixPrBc7qXvXFCicm8jLMMlT99MfmchLNA=" : v
    },
    filename: String // Stores Cloudinary's public_id
  },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
})

listeningSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});



const Listing=mongoose.model("Listing",listeningSchema)
module.exports=Listing 