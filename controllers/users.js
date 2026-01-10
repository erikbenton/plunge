const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.setNotification("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/diveSpots";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.setNotification("success", "Goodbye!");
    res.redirect("/diveSpots");
  });
};