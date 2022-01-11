var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
bodyParser = require('body-parser'),
path = require('path');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/themeDB");
var theme = require("./model/theme.js");
var user = require("./model/user.js");

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

var userId;

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          userId = decoded.id;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false,
            decode:decoded
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", async(req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const data = await user.findOne({ username: req.body.username });
        if (data) {
          if (bcrypt.compareSync(data.password, req.body.password)) {
            checkUserAndGenerateToken(data, req, res);
          } else {
            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }
        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      const data = await user.find({ username: req.body.username });
        if (data.length == 0) {
          const new_theme = new theme();
          new_theme.theme = 'Grey';
          const savedtheme =  await new_theme.save();

          let User = new user({
            username: req.body.username,
            password: req.body.password,
            themeId: savedtheme._id 
          });
          await User.save();
          res.json({
            message: 'registered Successfully.',
            status: true
          });
          }
        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

    }catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
   jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, async(err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      const newuser  = await data.populate('themeId');
      const gettheme = await theme.findOne({_id: newuser.themeId});
      res.json({
        message: 'Login Successfully.',
        token: token,
        id:data._id,
        theme: gettheme.theme,
        status: true
      });
    }
  });
}

app.patch("/add-theme", async(req, res) => {
  try {
    if (req.body && req.body.name) {
      const user1 = await user.findOne({_id:userId})
      const data = await theme.updateOne({_id  : user1.themeId}, {theme:req.body.name});
        if (data) { 
          res.status(200).json({
            status: true,
            title: 'Theme Added successfully.'
          });
        }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
