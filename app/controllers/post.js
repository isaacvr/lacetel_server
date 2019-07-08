/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var express      = require('express');
var Influx       = require('influxdb-nodejs');
var bcrypt       = require('bcrypt-nodejs');

var influxToJSON = require('../utils/influx-to-json');
var service      = require('../../auth/tokenService');
var config       = require('../../config/config');
var STATES       = require('../../config/user_states');

var router  = express.Router();

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

router.post('/api/login', function(req, res) {

  var body = req.body || {};

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

        // console.log("USERS: ", users);

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
            // console.log(body.password, users[i].password, 'does not match');
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

router.post('/api/register', function(req, res) {

  var body = req.body;

  // console.log("REGISTER BODY: ", body);

  if ( body.email && body.password ) {

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
            .tag({
              email: body.email
            })
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


module.exports = function (app) {
  app.use('/', router);
};