if(process.env.NODE_ENV!="production"){
   require('dotenv').config()
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session=require('express-session')
const MongoStore=require('connect-mongo')
const flash =require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User = require('./models/user.js')

const listingRouter=require('./routes/listings.js')
const reviewRouter=require('./routes/review.js')
const userRouter=require('./routes/user.js')


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error is mongo session store",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },

}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
   res.locals.success=req.flash('success')
   res.locals.error=req.flash('error')
   res.locals.currUser=req.user
   next()
})



app.use('/listings',listingRouter)

app.use('/listings/:id/reviews', reviewRouter);

app.use('/', userRouter);



// app.get("/test-listing", async (req, res) => {
//     const testListing = new Listing({
//         title: "Test Beach House",
//         description: "Beautiful beachfront property",
//         price: 2000,
//         location: "Mumbai",
//         country: "India",
//         image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//     });
    
//     await testListing.save();
//     res.send("Test listing created!");
// });



app.use((err,req,res,next)=>{
    let{statusCode=500,message="Somting Went Wrong"}=err
    res.status(statusCode).render("error.ejs",{message})
})

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
});