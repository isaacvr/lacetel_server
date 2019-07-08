var express        = require('express');
// var session        = require('express-session');
// var glob           = require('glob');
// var favicon        = require('serve-favicon');
// var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var compress       = require('compression');
var methodOverride = require('method-override');
var cors           = require('cors');

// var logger = require('./logger');

module.exports = function(app, config) {

  var env = process.env.NODE_ENV || 'development';

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  // app.use(logger('dev'));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  require(config.root + '/app/controllers/home')(app);
  require(config.root + '/app/controllers/get')(app);
  require(config.root + '/app/controllers/post')(app);

  //var controllers = glob.sync(config.root + '/app/controllers/*.js');

  // controllers.forEach(function (controller) {
  //   require(controller)(app);
  // });

  app.use(function (req, res) {
    return res.status(404).jsonp({ message: 'Page not found' });
  });

  return app;
};