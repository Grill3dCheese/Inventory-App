var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var async = require("async");
var crypto = require("crypto");

// root route - login form
router.get("/", function(req, res){
	res.render("login", {page: "login"});
});

// login post route logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/inventory",
		successFlash: "Welcome back, you have successfully logged in.",
        failureRedirect: "/",
		failureFlash: true
        
    }), function(req, res){
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});

// post register logic
router.post("/register", function(req, res){
    var newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            email: req.body.email,
            avatar: req.body.avatar
        });
        
    if(req.body.adminCode === process.env.SECRETCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render("register", {error: err.message});
       }
       passport.authenticate("local")(req, res, function(){
            req.flash("success", "Hi, " + user.username + "! Thanks for creating a new account. Welcome to the Sign Dreamers Inventory Application!"); 
            res.redirect("/inventory"); 
       });
    });
 });

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've been logged out successfully! See you soon.");
    res.redirect("/");
});

// forgot password
router.get("/forgot", function(req, res){
    res.render("forgot"); 
});

module.exports = router;