var express = require("express");
var router = express.Router();
var Inventory = require("../models/item");
var middleware = require("../middleware");

// index of inventory page
router.get("/inventory", middleware.isLoggedIn, function(req, res){
    Inventory.find({}, function(err, items){
        if(err){
            console.log(err);
        } else {
             res.render("inventory/index", {items: items, page: "items"});
        }
    });
});

module.exports = router;