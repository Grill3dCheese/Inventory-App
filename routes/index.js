var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

// root route - login form
router.get("/", function(req, res){
	if (req.isAuthenticated()) {
		res.redirect("/inventory");
	} else {
		res.render("login", {page: "login"});
	}
});

// login post route logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/inventory",
		successFlash: "Welcome back, you've successfully logged in.",
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
            email: req.body.email
        });
        
    if(req.body.adminCode != process.env.SECRETCODE) {
        req.flash("error", "Apologies, that admin code did not match our records. Please try again.");
		return res.redirect("back");
    } else {
		newUser.isAdmin = true;
	}
	
    User.register(newUser, req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render("register", {error: err.message});
       }
       passport.authenticate("local")(req, res, function(){
            req.flash("success", "Hi, " + user.firstName + "! Thanks for creating a new account. Welcome to the Sign Dreamers Inventory Application!"); 
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

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: "keithmckenna.com",
		port: 465,
		secure: true,
        auth: {
          user: "hello@keithmckenna.com",
          pass: process.env.MAILEPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hello@keithmckenna.com',
        subject: 'Sign Dreamers inventory app password reset',
        text: 'You are receiving this because you (or someone else) has requested the reset of the password for your inventory account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: "keithmckenna.com",
		port: 465,
		secure: true,
        auth: {
          user: "hello@keithmckenna.com",
          pass: process.env.MAILEPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hello@keithmckenna.com',
        subject: 'Your Sign Dreamers inventory app password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your inventory account associated with: ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/inventory');
  });
});

module.exports = router;