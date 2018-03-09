const path = require("path");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const express = require("express");
const passport = require("passport");
const Strategy = require('passport-local').Strategy;
const db = require('./db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

const app = express();

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname + '/views'));

//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: path.join(__dirname + '/views'),
    partialsDir: path.join(__dirname + '/views')
  })
);

function addNewBlocks(floor, blocks){
  
}

app.get('/',
  function(req, res){
    res.redirect('/login')
  });
  
app.get('/login',
  function(req, res){
    res.render('loginPage');
  });

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    db.data.userLogin = req.user.username;
    res.redirect('/table');
  });
  
app.post('/blockall',
  function(req, res) {
  console.log(req.body)
    res.redirect('/table');
  });
app.get('/logout',
function(req, res){
  req.logout();
  res.redirect('/login');
});
app.get("/table", require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  res.render("table", db.data);
});

app.use(express.static(__dirname + "/views"));
app.listen(3000, () => console.log("server start in port:3000"));
