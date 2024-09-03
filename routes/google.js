const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Set up Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "",
    },
    (accessToken, refreshToken, profile, cb) => {
      // You can store the user in your database here
      // For now, just return the profile

      console.log(profile);

      return cb(null, profile);
    }
  )
);

// Route for Google login
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route for Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Successful login, redirect to protected route
    res.redirect("/protected");
  }
);

// Protected route
app.get("/protected", (req, res) => {
  if (req.user) {
    res.send(`Hello, ${req.user.displayName}!`);
  } else {
    res.send("You are not logged in");
  }
});

// Login route
app.get("/login", (req, res) => {
  res.send('Login with Google: <a href="/auth/google">Click here</a>');
});
