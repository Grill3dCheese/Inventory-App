var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You will need to be logged in to do that.");
    res.redirect("/login");
};

middlewareObj.isUserAdmin = function(req, res, next) {
	if(req.isAuthenticated() && req.user.isAdmin){
		return next();
	}
    req.flash("error", "Apologies, you don't have permission to do that.");
    res.redirect("/blog");
};


module.exports = middlewareObj;