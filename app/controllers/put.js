/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

/// Dependencies
var express = require('express');
// var moment = require('moment');
var Influx = require('influxdb-nodejs');
var config = require('../../config/config');
// var influxToJSON = require('../utils/influx-to-json');
//var mongoose     = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//mongoose.Promise = require('bluebird');

/// Router
var router = express.Router();

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);


/// Database models
//var User        = mongoose.model('User');
//var Sensor      = mongoose.model('Sensor');

/// PUT
// router.put('/api/renameSensor', function(req, res) {

//   var body = req.body;

//   if ( typeof body.id === 'string' &&
//        typeof body.idNew === 'string' &&
//        body.idNew.trim() != '' ) {

//     sensor.findOneAndUpdate({
//       id: body.id
//     }, {
//       id: body.idNew
//     }, function(err, sensor) {

//       if ( err ) {
//         return res.status(500).jsonp({ message: "No se pudo actualizar" });
//       }

//       if ( sensor ) {
//         return res.status(200).jsonp({ message: "Sensor " + body.id + " renombrado a " + body.idNew });
//       }

//       return res.status(404).jsonp({ message: "No se encontró el sensor " + body.id });

//     });

//   } else {
//     return res.status(400).jsonp({ message: "Error en el formato de los datos enviados." });
//   }

// });

// router.put('/api/modifyUser', function(req, res) {

//   var body = req.body;

//   if ( typeof body.password === 'string' ) {
//     if ( body.password === '' ) {
//       delete body.password;
//     } else {
//       body.password = bcrypt.hashSync(body.password);
//     }
//   }

//   if ( body.email ) {

//     user.findOne({
//       email: body.email
//     }).exec(function(err, user) {

//       if ( err ) {
//         return res.status(500).jsonp({ message: "Error en el servidor" });
//       }

//       if ( user ) {

//         for (var i in body) {
//           if ( body.hasOwnProperty(i) ) {
//             user[i] = body[i];
//           }
//         }

//         user.save(function(err) {
//           if ( err ) {
//             return res.status(500).jsonp({ message: "Error al modificar el usuario" });
//           }

//           //return res.status(200).jsonp({ message: "Uusuario modificado correctamente" });
//           return res.status(200).jsonp({ message: user });
//         })

//       } else {
//         return res.status(404).jsonp({ message: "No se pudo encontrar el usuario" });
//       }

//     });

//   } else {
//     return res.status(400).jsonp({ message: "Se requiere el email" });
//   }

// });

// module.exports = function (app) {
//   app.use('/', router);
// };

router.put('/api/renameSensor', function (req, res) {

  var body = req.body;

  if (typeof body.id === 'string' &&
    typeof body.idNew === 'string' &&
    body.idNew.trim() != '') {

    influx
      .findOneAndUpdate('Sensor', {
        id: body.id
      }, {
          id: body.idNew
        })
      .then(() => res.status(200).jsonp({ message: "Sensor " + body.id + " renombrado a " + body.idNew }))
      .catch((err) => {
        console.log('/api/renameSensor ERROR: ', err);
        return res.status(500).jsonp({ message: "No se pudo actualizar" });
      });
    return res.status(404).jsonp({ message: "No se encontró el sensor " + body.id });
  } else {
    return res.status(400).jsonp({
      message: "Error en el formato de los datos enviados."
    });
  }
});

router.put('/api/modifyUser', function (req, res) {

  var body = req.body;

  if (typeof body.password === 'string') {
    if (body.password === '') {
      delete body.password;
    } else {
      body.password = bcrypt.hashSync(body.password);
    }
  }

  if (body.email) {
    influx
      .findOneAndUpdate('User', {
        email: body.email
      }, body)
      .then(function () {
        return res.status(200).jsonp({ message: "Datos modificados correctamente" });
      })
      .catch((err) => {
          console.log('/api/modifyUser ERROR: ', err);
          return res.status(500).jsonp({ message: "Error al modificar el usuario" });
        //return res.status(200).jsonp({ message: "Uusuario modificado correctamente" });
      })
  } else {
    return res.status(400).jsonp({ message: "Se requiere el email" });
  }

});

module.exports = function (app) {
  app.use('/', router);
};