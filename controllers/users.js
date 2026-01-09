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
    setNotification(req.sessionID, "success", "Welcome to Plunge!");
    res.redirect("/diveSpots");
  } catch (e) {
    setNotification(req.sessionID, "error", e.message);
    res.redirect("/register");
  }
});

userRouter.get("/login", (req, res) => {
  res.render("users/login");
});

userRouter.post("/login", passport.authenticate('local', { failureMessage: true, failureRedirect: "/login"}), async (req, res) => {
  setNotification(req.sessionID, "success", "Welcome back!");
  res.redirect("/diveSpots");
});

module.exports = userRouter;