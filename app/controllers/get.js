/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var express      = require('express');
var moment       = require('moment');
var Influx       = require('influxdb-nodejs');
var config       = require('../../config/config');
var CATEGORIES   = require('../../config/user_categories').enumCategories;
var influxToJSON = require('../utils/influx-to-json');
var authProvider = require('../../auth');

var router  = express.Router();

var ensureAuth = authProvider.ensureAuthenticated;
var minLeven = authProvider.minLevel;

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

router.get('/api/users', ensureAuth, minLeven(CATEGORIES.moderador), function(req, res) {

  influx
    .query('User')
    .where('username', 'root', '!=')
    .then(influxToJSON)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => {
      console.log("/api/users ERROR: ", err);
      return res.status(500).jsonp({ message: "Error en el servidor" });
    });

});

router.get('/api/user/:username', ensureAuth, function(req, res) {

  // console.log("PARAMS: ", req.params.username);

  influx
    .query('User')
    .where('username', 'root', '!=')
    .where({
      username: req.params.username,
      email: req.params.username
    }, "or")
    .then(influxToJSON)
    .then((data) => {
      if ( data.length === 0 ) {
        return res.status(404).jsonp({ message: "Usuario no encontrado" });
      }
      return res.status(200).jsonp(data[0]);
    })
    .catch((err) => {
      console.log("/api/user/:username ERROR: ", err);
      return res.status(500).jsonp({ message: "Error en el servidor" });
    });

});

router.get('/api/signals', ensureAuth, function(req, res) {

  var query = [];
  var from = moment( new Date(req.query.from) );
  var to = moment( new Date(req.query.to) );

  // console.log(req.query.from, req.query.to);

  if ( from.isValid() ) {
    query.push('"date" >= ' + from.format('x'));
  }

  if ( to.isValid() ) {
    query.push('"date" <= ' + to.format('x'));
  }

  // console.log('QUERY: ', query);

  influx
    .query('SignalLevel')
    .where(query.join(' and '))
    //.then((signals) => objPath(signals, ['results', '0', 'series', '0']))
    .then(influxToJSON)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => {
      console.log('/api/signals ERROR: ', err);
      return res.status(500).jsonp({ message: "Error en la base de datos" });
    })

});

router.get('/api/sensors', /*ensureAuth,*/ function(req, res) {

  influx
    .query('Sensor')
    .then(influxToJSON)
    .then((data) => res.status(200).jsonp(data))
    .catch((err) => {
      console.log('/api/sensors ERROR: ', err);
      return res.status(500).jsonp({ message: 'Error en la base de datos' });
    });

});

module.exports = function (app) {
  app.use('/', router);
};