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

// numbers & letters route
router.get("/numlet", middleware.isLoggedIn, function(req, res){
	Item.find({$or:[{category: "number"},{category:"letter"}]}, function(err, items){
		if(err){
			console.log(err);
		} else {
			res.render("inventory/index", {items: items, page: "items"});
		}
	});
});

// graphics route
router.get("/graphic", middleware.isLoggedIn, function(req, res){
	Item.find({category: "graphic"}, function(err, items){
		if(err){
			console.log(err);
		} else {
			res.render("inventory/index", {items: items, page: "items"});
		}
	});
});

// stars route
router.get("/star", middleware.isLoggedIn, function(req, res){
	Item.find({category: "star"}, function(err, items){
		if(err){
			console.log(err);
		} else {
			res.render("inventory/index", {items: items, page: "items"});
		}
	});
});

// balloons route
router.get("/balloon", middleware.isLoggedIn, function(req, res){
	Item.find({category: "balloon"}, function(err, items){
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

// edit item route
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
        Item.findById(req.params.id, function(err, foundItem){
            if(err || !foundItem){
                req.flash("error", "Apologies, that item was not found!");
                res.redirect("back");
            } else {
                res.render("inventory/edit", {item: foundItem});
            }
        });
});

// update item route
router.put("/:id", middleware.isLoggedIn, function(req, res){

    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Item has been successfully updated!");
            res.redirect("/inventory/" + item._id);
        }
    });
  });

// destroy item route
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Item.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Hmmm, something went wrong. That item was not deleted.");
            res.redirect("/inventory");
        } else {
            req.flash("success", "*Entry successfully deleted!");
            res.redirect("/inventory");
        }
    });
});

module.exports = router;