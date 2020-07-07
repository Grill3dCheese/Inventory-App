var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated() && req.user.isAdmin){
		return next();
	}
    req.flash("error", "Sorry, you\'ll need to be logged in to proceed.");
    res.redirect("/");
};

module.exports = middlewareObj;