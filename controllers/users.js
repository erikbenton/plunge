const userRouter = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const { setNotification } = require("../utils/notifications");

userRouter.get("/register", (req, res) => {
  res.render("users/register");
});

userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, err => {
      if (err) { return next(err); }
      req.setNotification("success", "Welcome to Plunge!");
      res.redirect("/diveSpots");
    });
  } catch (e) {
    req.setNotification("error", e.message);
    res.redirect("/register");
  }
});

userRouter.get("/login", (req, res) => {
  res.render("users/login");
});

userRouter.post("/login", passport.authenticate('local', { failureMessage: true, failureRedirect: "/login" }), async (req, res) => {
  req.setNotification("success", "Welcome back!");
  res.redirect("/diveSpots");
});

userRouter.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.setNotification("success", "Goodbye!");
    res.redirect("/diveSpots");
  });
});

module.exports = userRouter;