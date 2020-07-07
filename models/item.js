var mongoose = require("mongoose");

// schema setup
var itemSchema = new mongoose.Schema({
    name: String,
	quantity: Number,
    category: String,
	tag: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        username: String
        },
});

module.exports = mongoose.model("Item", itemSchema);