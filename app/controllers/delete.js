/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

/// Dependencies
var express      = require('express');
var Influx       = require('influxdb-nodejs');
var config       = require('../../config/config');
var influxToJSON = require('../utils/influx-to-json');
var request      = require('request-promise');
var authProvider = require('../../auth')

var ensureAuth = authProvider.ensureAuthenticated;
var minLevel = authProvider.minLevel;

/// Router
var router = express.Router();

/// Database models
const db = config.db;
const dbUrl = `http://${db.host}:${db.port}/${db.database}`;
const influx = new Influx(dbUrl);

/// DELETE
router.delete('/api/sensor/:id', ensureAuth, minLevel('admin'), function(req, res) {

  const id = req.params.id;

  influx
    .query('Sensor')
    .where('id', id)
    .then(influxToJSON)
    .then((sensors) => {

      if ( sensors.length === 0 ) {
        return res.status(404).jsonp({ message: "Sensor no encontrado" });
      }

      if ( sensors.length > 1 ) {
        return res.status(500).jsonp({ message: "Error. Multiples sensores con el mismo ID." });
      }

      request({
          method: 'POST',
          uri: `http://${db.host}:${db.port}/query`,
          form: {
            db: 'lacetel',
            q: `drop series from "Sensor" where id='${id}'`
          },
          json: true
        })
        .then(() => res.status(200).jsonp({ message: "Sensor eliminado correctamente" }))
        .catch((err) => {
          console.log('/api/sensor/:id ERROR: ', err);
          return res.status(500).jsonp({ message: "Error al intentar eliminar el sensor" });
        });

    })
    .catch((err) => {
      console.log('/api/sensor/:id ERROR: ', err);
      return res.status(500).jsonp({ message: "Error en la base de datos" });
    });

});

router.delete('/api/user/:email', ensureAuth, minLevel('admin'), function(req, res) {

  if (req.params.email === 'root@root.com') {
    return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
  }

  influx
    .query('User')
    .where('email', req.params.email)
    .then(influxToJSON)
    .then((users) => {
      if ( users.length === 0 ) {
        return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
      }

      if ( users.length > 1 ) {
        return res.status(500).jsonp({ message: "Error, multiples usuarios con el mismo email" });
      }

      const user = users[0];

      const deleteUser = function() {
        request({
          method: 'POST',
          uri: `http://${db.host}:${db.port}/query`,
          form: {
            db: 'lacetel',
            q: `drop series from "User" where email='${req.params.email}'`
          },
          json: true
        })
        .then(() => res.status(200).jsonp({ message: "Usuario eliminado correctamente" }))
        .catch((err) => {
          console.log('/api/user/:email ERROR: ', err);
          return res.status(500).jsonp({ message: "No se pudo eliminar el usuario" });
        });
      };

      if ( ["superadmin", "admin"].indexOf(user.category) > -1 ) {
        influx
          .query('User')
          .where('category', ["superadmin", "admin"])
          .then(influxToJSON)
          .then((admins) => {
            if ( admins.length <= 1 ) {
              return res.status(401).jsonp({ message: "Debe haber al menos un administrador." });
            }
            deleteUser();
          })
          .catch((err) => {
            console.log('/api/user/:email ERROR: ', err);
            return res.status(500).jsonp({ message: "Error en la base de datos" });
          });
      } else {
        deleteUser();
      }

    })
    .catch((err) => {
      console.log('/api/user/:email ERROR: ', err);
      return res.status(500).jsonp({ message: "Error en la base de datos" });
    });
});

module.exports = function (app) {
  app.use('/', router);
};

// /// Dependencies
// var express      = require('express');
// var mongoose     = require('mongoose');
// mongoose.Promise = require('bluebird');

// /// Router
// var router      = express.Router();

// /// Database models
// var User        = mongoose.model('User');
// var Sensor      = mongoose.model('Sensor');

// /// DELETE
// router.delete('/api/sensor/:id', function(req, res) {

//   sensor.deleteOne({
//     id: req.params.id
//   })
//   .exec(function(err) {

//     if (err) {
//       return res.status(500).jsonp({ message: "Error en la base de datos" });
//     }

//     return res.status(200).jsonp({ message: "Sensor eliminado" });

//   });

// });

// router.delete('/api/user/:email', function(req, res) {

//   if ( req.params.email === 'root@root.com' ) {
//     return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
//   }

//   user.findOne({
//     email: req.params.email
//   }, async function(err, user) {
//     if ( err ) {
//       return res.status(500).jsonp({ message: "Error en la base de datos" });
//     }

//     if ( user ) {
//       if ( ["superadmin", "admin"].indexOf(user.category) > -1 ) {
//         user
//           .count({
//             category: {
//               $in: ["superadmin", "admin"]
//             }
//           }, function(err, cant) {
//             if ( err ) {
//               return res.status(500).jsonp({ message: "Error en la base de datos" });
//             }

//             if ( cant === 1 ) {
//               return res.status(403).jsonp({ message: "Debe haber al menos un administrador" });
//             }


//           });
//       } else {
//         await user.remove();
//         if ( user.$isDeleted() ) {
//           return res.status(200).jsonp({ message: "Usuario eliminado correctamente" });
//         } else {
//           return res.status(500).jsonp({ message: "No se pudo eliminar el usuario" });
//         }
//       }
//     } else {
//       return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
//     }

//   });

// });

// module.exports = function (app) {
//   app.use('/', router);
// };