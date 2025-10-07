const express=require('express')
const router = express.Router({ mergeParams: true });
const User=require('../models/user.js')
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/users.js')


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post('/signup',wrapAsync(userController.signupUser))

//login

router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post("/login",saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
  }),userController.useLogin)

//logout

router.get("/logout",userController.userLogout)

module.exports=router