const path = require("path");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const express = require("express");
const passport = require("passport");
const fs = require("fs-extra");

const db = require("./db");
require("./moduls/strategy")();
const addNewBlocks = require("./moduls/addNewBlocks");

const app = express();

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname + "/views"));

//app.use(require('morgan')('combined'));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: path.join(__dirname + "/views"),
    partialsDir: path.join(__dirname + "/views")
  })
);

app.get("/", function(req, res) {
  res.redirect("/login");
});

app.get("/login", function(req, res) {
  res.render("loginPage");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/table");
  }
);

app.post("/blockall", function(req, res) {
  const floor = Number(req.body.floor1);
  const blocks = req.body.blocks.split(", ");
  addNewBlocks(floor, blocks)
    .then(() => {
      console.log("write success");
      res.redirect("/table");
    })
    .catch(err => console.log(err.message));
});

app.post("/blocknow", function(req, res) {
  const floor = Number(req.body.floor2);
  const blocknow = Number(req.body.blocknow);
  console.log(floor, blocknow);
  addNewBlocks(floor, blocknow)
    .then(() => {
      console.log("write success");
      res.redirect("/table");
    })
    .catch(err => console.log(err.message));
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});
app.get(
  "/table",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    fs
      .readJson("./db/data.json")
      .then(data => {
        data.userLogin = req.user.username;
        res.render("table", data);
      })
      .catch(err => console.log(err.message));
  }
);

app.use(express.static(__dirname + "/views"));
app.listen(3000, () => console.log("server start in port:3000"));
