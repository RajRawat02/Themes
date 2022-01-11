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
      console.log(JSON.stringify(req.headers.token))
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        //console.log("decoded",decoded,JSON.stringify(req.headers.token));
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
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
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
      })
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
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              
                if (data) {

                    let new_theme = new theme();
                    new_theme.theme = '';
                    new_theme._id = data._id;
                    new_theme.save((err, data) => {
                      if (err) {
                        res.status(400).json({
                          errorMessage: err,
                          status: false
                        });
                      } else {
                        res.status(200).json({
                          status: true,
                          title: 'Registered Successfully.'
                        });
                      }
                    });
              
                }
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

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

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        id:data._id,
        status: true
      });
    }
  });
}

app.patch("/add-theme", (req, res) => {
  try {
    if (req.body && req.body.name) {
      console.log("req",req.body,userId)
      let new_theme = new theme();
      new_theme.update({_id  : ObjectId(userId)}, {theme:req.body.name},(err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Theme Added successfully.'
          });
        }
      });

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
