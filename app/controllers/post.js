/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

// /// Dependencies
// var express      = require('express');
// var mongoose     = require('mongoose');
// var bcrypt       = require('bcrypt-nodejs');
// mongoose.Promise = require('bluebird');
// var service = require('../../auth/tokenService');
// var STATES  = require('../../config/user_states');
// /// Router
// var router      = express.Router();
// /// Database models
// var User        = mongoose.model('User');
// var Sensor      = mongoose.model('Sensor');
// /// POST
// router.post('/api/register', function(req, res) {
// var body = req.body;
// // console.log("REGISTER BODY: ", body);
// if ( body.hasOwnProperty('email') && body.hasOwnProperty('password') ) {
// user.findOne({
// email: body.email
// }, function(err, data) {
// if ( err ) {
// // console.log("Error en el servidor: ", err);
// return res.status(500).jsonp({ message: "Error en el servidor" });
// }
// if ( data ) {
// return res.status(400).jsonp({ message: "Ya existe un usuario con ese email" });
// } else {
// body.password = bcrypt.hashSync(body.password);
// body.category = body.category || 'user';
// var user = new User(body);
// user.save(function(err1) {
// if ( err1 ) {
// // console.log("Inner Error en el servidor: ", err1);
// return res.status(500).jsonp({ message: "Error en el servidor" });
// }
// return res.status(200).jsonp({ message: "Usuario registrado correctamente" });
// });
// }
// });
// } else {
// return res.status(400).jsonp({ message: "Se require un usuario y contraseña" });
// }
// });
// router.post('/api/login', function(req, res) {
// var { body } = req;
// // console.log('BODY: ', body);
// if ( body.username && body.password ) {
// user
// .find()
// .or([{ username: body.username }, { email: body.username }])
// .exec(function(err, data) {
// if ( err ) {
// console.log('Error en el servidor: ', err);
// return res.status(500).jsonp({ message: "Error en el servidor" });
// }
// // console.log("USERS: ", data);
// for (var i = 0, maxi = data.length; i < maxi; i += 1) {
// if ( bcrypt.compareSync(body.password, data[i].password) ) {
// if ( data[i].state === STATES.INACTIVE ) {
// return res.status(401).jsonp({ message: "Usuario deshabilitado." });
// } else if ( data[i].state === STATES.PENDING ) {
// return res.status(401).jsonp({ message: "Usuario en espera de aprobación." });
// }
// return res.status(200).jsonp({ token: service.createToken(data[i]) });
// }
// }
// return res.status(401).jsonp({ message: "Usuario o contraseña no válido" });
// });
// } else {
// return res.status(400).jsonp({ message: "Se require un usuario y contraseña" });
// }
// });
// router.post('/api/sensor', function(req, res) {
// if ( typeof req.body.id === 'string' && req.body.id.trim() != '' ) {
// var id = req.body.id.trim();
// sensor
// .findOne({ id })
// .exec(async function(err, sensor) {
// if ( err ) {
// return res.status(500).jsonp({ message: "Error en la base de datos" });
// }
// if ( sensor ) {
// return res.status(400).jsonp({ message: "Ya existe un sensor con ID " + id });
// }
// var newSensor = new Sensor({
// id,
// auth: true
// });
// var saved = await newSensor.save();
// if ( saved === newSensor ) {
// return res.status(200).jsonp({ message: "Sensor guardado correctamente" });
// }
// return res.status(500).jsonp({ message: "No se pudo guardar el sensor" });
// });
// } else {
// return res.status(400).jsonp({ message: "Se necesita el id del sensor" });
// }
// });
// router.post('/api/authorizeSensor', function(req, res) {
// if ( typeof req.body.id === 'string' && req.body.id.trim() != '' ) {
// var id = req.body.id.trim();
// sensor.findOneAndUpdate({
// id
// }, {
// auth: true
// }, function(err, sensor) {
// if (err) {
// return res.status(500).jsonp({ message: "Error en la base de datos" });
// }
// if ( sensor ) {
// return res.status(200).jsonp({ message: "Sensor " + id + " autorizado" });
// }
// return res.status(404).jsonp({ message: "Sensor " + id + " no encontrado" });
// })
// } else {
// return res.status(400).jsonp({ message: "Se necesita un ID" });
// }
// });
// //

var express      = require('express');
var Influx       = require('influxdb-nodejs');
var bcrypt       = require('bcrypt-nodejs');
// var moment       = require('moment');

var influxToJSON = require('../utils/influx-to-json');
var service      = require('../../auth/tokenService');
var config       = require('../../config/config');
var STATES       = require('../../config/user_states');

var router  = express.Router();

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

router.post('/api/login', function(req, res) {

  var body = req.body;

  // console.log('BODY: ', body);

  if ( body.username && body.password ) {

    influx
      .query('User')
      .where({
        username: body.username,
        email: body.username
      }, 'or')
      .then(influxToJSON)
      .then((users) => {

        console.log("USERS: ", users);

        if ( users.length === 0 ) {
          return res.status(404).jsonp({ message: "Usuario no encontrado" });
        }

        for (var i = 0, maxi = users.length; i < maxi; i += 1) {
          if ( bcrypt.compareSync(body.password, users[i].password) ) {
            if ( users[i].state === STATES.INACTIVE ) {
              return res.status(401).jsonp({ message: "Usuario deshabilitado." });
            } else if ( users[i].state === STATES.PENDING ) {
              return res.status(401).jsonp({ message: "Usuario en espera de aprobación." });
            }
            return res.status(200).jsonp({ token: service.createToken(users[i]) });
          } else {
            console.log(body.password, users[i].password, 'does not match');
          }
        }

        return res.status(401).jsonp({ message: "Usuario o contraseña no válido" });

      })
      .catch((err) => {
        console.log('/api/login ERROR: ', err);
        return res.status(500).jsonp({ message: "Error en la base de datos" });
      });
  } else {
    return res.status(400).jsonp({ message: "Faltan algunos datos por enviar" });
  }
});

router.post("/api/register", function(req, res) {

  var body = req.body;

  // console.log("REGISTER BODY: ", body);

  if (body.hasOwnProperty("email") && body.hasOwnProperty("password")) {

    body.email = body.email.trim();

    influx
      .query('User')
      .where('email', body.email)
      .then(influxToJSON)
      .then((data) => {
        if (data.length > 0) {
          return res.status(400).jsonp({ message: "Ya existe un usuario con ese email" });
        } else {
          body.password = bcrypt.hashSync(body.password);
          body.category = body.category || "user";
          influx
            .write('User')
            .field(body)
            .then(() => {
              res.status(200).jsonp({ message: "Usuario registrado correctamente" })
            })
            .catch((err) => {
              console.log('/api/register ERROR: ', err);
            });
        }
      })
      .catch((err) => {
        console.log('/api/register ERROR: ', err);
        return res.status(500).jsonp({ message: "Error en el servidor" });
      })
  } else {
    return res.status(400).jsonp({ message: "Se require un usuario y contraseña" });
  }
});

router.post('/api/sensor', function(req, res) {

  if (typeof req.body.id === 'string' && req.body.id.trim() != '') {
    var id = req.body.id.trim();
    influx
      .query('Sensor')
      .where('id', id)
      .then(influxToJSON)
      .then(function (sensors) {
        if ( sensors.length > 0 ) {
          return res.status(400).jsonp({ message: "Ya existe un sensor con ID " + id });
        }

        influx
            .write('Sensor')
            .tag({
              id,
            })
            .field({
              lat: 0,
              lon: 0,
              val: 0,
              lastSeen: '',
              auth: false,
            })
            .then(() => {
              res.status(200).jsonp({ message: "Sensor registrado correctamente" })
            })
            .catch((err) => {
              console.log('/api/sensor ERROR: ', err);
              return res.status(500).jsonp({ message: "No se pudo guardar el sensor" });
            });
      })
      .catch((err) => {
        console.log('/api/sensor ERROR: ', err);
        return res.status(500).jsonp({ message: "Error en la base de datos" });
      });
  } else {
    return res.status(400).jsonp({ message: "Se necesita el id del sensor" });
  }
});

router.post('/api/authorizeSensor', function (req, res) {

  if (typeof req.body.id === 'string' && req.body.id.trim() != '') {
    var id = req.body.id.trim();
    influx
      .findOneAndUpdate('Sensor', {
        id
      }, {
        auth: true
      })
      .then((sensor) => {
        console.log("sensor: ", sensor);
        return res.status(200).jsonp({ message: "Sensor " + id + " autorizado" });
      })
      .catch((err) => {
        console.log('/api/authorizeSensor ERROR: ', err);
        return res.status(500).jsonp({ message: "Error en la base de datos" });
      });
  } else {
    return res.status(400).jsonp({ message: "Se necesita un ID" });
  }
});

module.exports = function (app) {
  app.use('/', router);
};