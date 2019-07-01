/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

 'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var TOKEN_SECRET = require('../config/token');
var CATEGORIES = require('../config/user_categories').enumCategories;

var User = mongoose.model('User');

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

    next();
  } catch(e) {
    return res.status(401).jsonp({ message: "Token inválido" });
  }

}

function atLeast(user, category) {

  if ( !CATEGORIES.hasOwnProperty(user) || !CATEGORIES.hasOwnProperty(category) ) {
    throw new TypeError('Invalid user category');
  }

  var cat = ( typeof category === 'string' ) ? CATEGORIES[ category ] : category;
  var userCat = ( typeof user.category === 'string' ) ? CATEGORIES[ user.category ] : user.category;

  return userCat <= cat;

}

function minLevel(type) {

  var _type = type;

  return function(req, res, next) {

    if ( req.user ) {

      User.findOne({
        email: req.user.email
      }, function(err, user) {
        if ( err ) {
          return res.status(500).jsonp({ message: "Error en la base de datos" });
        }
        if ( user ) {
          if ( atLeast(user, _type) ) {
            return next();
          }
          return res.status(401).jsonp({ message: "Necesitas al menos ser " + _type });
        }

        return res.status(404).jsonp({ message: "Usuario no válido" });

      });

    } else {
      return res.status(401).jsonp({ message: "Necesita autorización" });
    }
  }

}

module.exports = {
  ensureAuthenticated,
  minLevel
};