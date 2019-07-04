/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

 'use strict';

var jwt          = require('jwt-simple');
var moment       = require('moment');
// var Influx       = require('influxdb-nodejs');
var TOKEN_SECRET = require('../config/token');
var CATEGORIES   = require('../config/user_categories').enumCategories;
// var config       = require('../config/config');
// var influxToJSON = require('../app/utils/influx-to-json');

// const db = config.db;
// const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

function ensureAuthenticated(req, res, next) {

  if ( !req.headers.authorization ) {
    return res.status(401).jsonp({ message: "Necesita autorización" });
  }

  var token = req.headers.authorization.split(' ')[1];

  try {
    var payload = jwt.decode(token, TOKEN_SECRET);

    if ( payload.exp <= moment().unix() ) {
      return res.status(401).jsonp({ message: "El token ha expirado" });
    }

    req.user = payload.sub;

    return next();
  } catch (e) {
    return res.status(401).jsonp({ message: "Token inválido" });
  }

}

function atLeast(user, category) {

  if ( !CATEGORIES.hasOwnProperty(user.category) || !CATEGORIES.hasOwnProperty(category) ) {
    throw new TypeError('Invalid user category');
  }

  var cat = '';
  var userCat = '';

  if ( typeof category === 'string' ) {
    cat = CATEGORIES[category];
  } else {
    cat = category;
  }

  if ( typeof user.category === 'string' ) {
    userCat = CATEGORIES[user.category];
  } else {
    userCat = user.category;
  }

  return userCat <= cat;

}

function minLevel(type) {

  return function(req, res, next) {

    if ( req.user ) {

      if ( atLeast(req.user, type) ) {
        return next();
      }
      return res.status(401).jsonp({ message: "Necesitas al menos ser " + type });

      // influx
      // .query('User')
      // .where({
      // email: req.user.email
      // })
      // .then(influxToJSON)
      // .then((user) => {
      // if ( user.length > 0 ) {
      // if ( atLeast(user[0], _type) ) {
      // return next();
      // }
      // return res.status(401).jsonp({ message: "Necesitas al menos ser " + _type });
      // }
      // return res.status(404).jsonp({ message: "Usuario no encontrado" });
      // })
      // .catch((err) => {
      // return res.status(500).jsonp({ message: "Error en la base de datos" });
      // });//

    } else {
      return res.status(401).jsonp({ message: "Necesita autorización" });
    }
  }

}

module.exports = {
  ensureAuthenticated,
  minLevel
};