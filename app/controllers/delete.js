/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

/// Dependencies
var express = require('express');
var Influx = require('influxdb-nodejs');
var influxToJSON = require('../utils/influx-to-json');
// var mongoose     = require('mongoose');
// mongoose.Promise = require('bluebird');

/// Router
var router = express.Router();

/// Database models
// var User        = mongoose.model('User');
// var Sensor      = mongoose.model('Sensor');

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

/// DELETE
router.delete('/api/sensor/:id', function (req, res) {

  influx
    .delete({
      id: req.params.id
    })
    .then(function () {
      return res.status(200).jsonp({ message: "Sensor eliminado" });
    })
    .catch(function (err) {
      return res.status(500).jsonp({ message: "Error en la base de datos" });
    });

});

router.delete('/api/user/:email', function (req, res) {

  if (req.params.email === 'root@root.com') {
    return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
  }
  influx
    .query('User')
    .where("email", req.params.email)
    .then(influxToJSON)
    .then(function(users) {
      if ( users.length > 0) {
        var user = users[0];
        if (["superadmin", "admin"].indexOf(user.category) > -1) {
          influx
            .query('User')
            .where('category',["superadmin", "admin"])
            .then(influxToJSON)
            .then(function(admins) {
              if (admins.length === 1) {
                return res.status(403).jsonp({ message: "Debe haber al menos un administrador" });
              }
              
            })
            .catch(function () {
              return res.status(500).jsonp({ message: "Error en la base de datos" });
            });
        } 
      } else {
        return res.status(404).jsonp({ message: "No existe ningún usuario con ese email" });
      }
    })
    .catch(() => {
      return res.status(500).jsonp({ message: "Error en la base de datos" });
    })

  

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

//   Sensor.deleteOne({
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

//   User.findOne({
//     email: req.params.email
//   }, async function(err, user) {
//     if ( err ) {
//       return res.status(500).jsonp({ message: "Error en la base de datos" });
//     }

//     if ( user ) {
//       if ( ["superadmin", "admin"].indexOf(user.category) > -1 ) {
//         User
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