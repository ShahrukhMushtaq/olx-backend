var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');
const webpush = require('web-push');
const vapidKeys = {
  "publicKey":'BA39bIgjc0bha3q0YQ_JID8PzY-c4FrIzsiGlrDiP8nSHKpKxATO363znw8-D5JyhJn418DGxt8nJO3hi7R6JFE',
  "privateKey":'adISDtUh5cYptob24NGivQ6QdFeq7cYnjVsjF7zEtH0'
};
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var submitAdRouter = require('./routes/submit-ad');
var searchAdRouter = require('./routes/search-ad');
var pushNotif = require('./routes/push-notif')

var app = express();

// mongoose.connect('mongodb://localhost:27017/olx_pwa', { useNewUrlParser: true });
mongoose.connect('mongodb://shahrukhmushtaq:shahrukh001@ds237832.mlab.com:37832/olx-pwa', { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  // console.log('Connected to database mongodb @ 27017');
  console.log('Connected to database mLab');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    console.log('Error in database connection' + err);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "https://olx-back.herokuapp.com/");
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/submit-ad', submitAdRouter);
app.use('/api/search-ad', searchAdRouter);
app.use('/api/notifications', pushNotif);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

module.exports = app;
