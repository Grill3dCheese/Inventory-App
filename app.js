// require('dotenv').config();

var express			= require("express"),
	app				= express(),
	mongoose		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	bodyParser		= require("body-parser");

//requiring routes
var indexRoutes		= require("./routes/index")

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/inventory_app")', { userNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
		.then(() => console.log(`Database connected.`))
		.catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

// Passport Configuration
app.use(require("express-session")({
	secret: "Dairy is the devil!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The server has started.");
});