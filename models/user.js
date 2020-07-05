var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, uniqueCaseInsensitive: true},
    password: String,
    firstName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false, required: true}
});

UserSchema.plugin(uniqueValidator);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);