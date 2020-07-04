var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var async = require("async");
var crypto = require("crypto");

// root route - login form
router.get("/", function(req, res){
	res.render("login");
});

// login post route logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/posts",
		successFlash: "Hey you! Welcome back. ^_^ Enjoy your time here!",
        failureRedirect: "/login",
		failureFlash: true
        
    }), function(req, res){
});

module.exports = router;