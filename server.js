const path = require("path");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const app = express();
const mysql = require("mysql");
// const connection = mysql.createConnection({
//     host:'shelmets.mysql.pythonanywhere-services.com',
//     user:'shelmets'
// });
// connection.connect();
// app.use(session({
//     store: new RedisStore({
//         url: config.redisStore.url
//     }),
//     secret: config.redisStore.secret,
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
let data = {
  floors: [
    {
      floor: "10",
      today: "1002",
      allrooms: "1002,1003"
    },
    {
      floor: "9",
      today: "902",
      allrooms: "902,903"
    }
  ]
};

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: path.join(__dirname + '/views'),
    partialsDir: path.join(__dirname + '/views')
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname + '/views'));

app.get("/", (req, res) => {
  res.render('loginPage');
});
app.get("/table", (req, res) => {
  res.render("table", data);
});

app.use(express.static(__dirname + "/public"));
app.listen(3000, () => console.log("server start in port:3000"));
