const userRouter = require("express").Router();
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleWare");
const users = require("../controllers/users");

userRouter.route("/register")
  .get(users.renderRegisterForm)
  .post(users.register);

userRouter.route("/login")
  .get(users.renderLoginForm)
  .post(storeReturnTo,
    passport.authenticate('local', { failureMessage: true, failureRedirect: "/login" }),
    users.login);

userRouter.get('/logout', users.logout);

module.exports = userRouter;