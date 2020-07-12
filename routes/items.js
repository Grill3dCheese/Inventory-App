var express = require("express");
var router = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");

// index of inventory page
router.get("/", middleware.isLoggedIn, function(req, res){
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        } else {
             res.render("inventory/index", {items: items, page: "items"});
        }
    });
});

// Add item to inventory database routing
// CREATE - add new item
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to items array
	var name = req.body.name;
	var quantity = req.body.quantity;
	var category = req.body.category;
	var tag = req.body.tag;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newItem = {name: name, quantity: quantity, category: category, tag: tag, image: image, description: desc, author: author};
	// Create a new item and save to DB
	Item.create(newItem, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to inventory page
			console.log(newlyCreated);
			req.flash("success", "Success! A new item has been added to inventory.");
			res.redirect("/inventory");
		}
	});
});

// New Item
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("inventory/new");
});

// Show Item
router.get("/:id", function(req, res){
	Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
		if(err || !foundItem){
			console.log(err);
			req.flash("error", "Sorry, the item you are looking for does not exist.");
			res.redirect("/inventory");
		} else {
			console.log(foundItem);
			res.render("inventory/show", {item: foundItem});
		}
	});
});

module.exports = router;