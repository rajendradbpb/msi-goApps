var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./server/db.js');
var passport = require('passport');
var jwt     = require('jsonwebtoken');
var passwordHash = require('password-hash-and-salt');
// initilising routes
var routes = require('./server/routes/index');
var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
  var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })
// swagger integration
//const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./temp/swagger-sample.json');
//const swaggerDocument = require('./swagger.json');


// custom files starts
 var userModel = require('./server/models/userModel');
 var response = require("./server/component/response")
 var config = require("config")
var logger = require("./server/component/log4j").getLogger('app');

var app = express();

// swagger
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS

    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({limit: '2048mb'}));
// app.use(bodyParser.urlencoded({limit: '2048mb', extended: true}));
app.use(jsonParser);
 app.use(urlencodedParser);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport init
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
/*
  * this is used to check the user in the database existence
  used in case of the signIn and signUp user
*/
passport.use('login', new LocalStrategy(
  function(username,password, done) {
    console.log("login instercepter  ",username,password);
    userModel.findOne({"username":username}).populate('role').exec(function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // console.log("got user/pass",username,password);
      // console.log("got user/pass >>>>>>>",user.username,user.password);
      passwordHash(password).verifyAgainst(user.password,function(error, verified) {
        //console.log("after verification ",error,user);
        if (error) {
          console.log("error");
          return done(err); }
        else if (!verified) {
           console.log("not verified");
          return done(null, false); }
        else return done(null, user);
      })
    });
  }
)
);
//
//
passport.use('token',new BearerStrategy(
  function(token, done) {
    jwt.verify(token,config.token.secret, function(err, decoded) {
      if (err) {
        console.log("error in verify token  ",err);
        return done(err,null);
      }
      else if(!decoded) {
        console.log("No  token  ",err);
        return done(null, false);
      }
      else {
         console.log("yes  token  ",decoded);
        return done(null, decoded);
      }
     });

  }
));
// passport.use('superAdmin',new BearerStrategy(
//   function(token, done) {
//     jwt.verify(token,config.token.secret, function(err, decoded) {
//       if (err) {
//         //console.log("error in verify token  ",err);
//         return done(err,null);
//       }
//       else if(!decoded) {
//         // console.log("No  token  ",err);
//         return done(null, false);
//       }
//       else {
//         console.log("yes  token  ",decoded);
//         return done(null, decoded);
//       }
//      });
//
//   }
// ));


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  logger.error(err);
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
