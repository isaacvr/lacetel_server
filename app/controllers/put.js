/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

/// Dependencies
var express      = require('express');
var Influx       = require('influxdb-nodejs');
var config       = require('../../config/config');
var bcrypt       = require('bcrypt-nodejs');
var influxToJSON = require('../utils/influx-to-json');
var request      = require('request-promise');

/// Router
var router = express.Router();

const db = config.db;
const influx = new Influx(`http://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`);

/// Helper functions
function exists(measurement, field, value) {
  return influx
    .query(measurement)
    .where(field, value)
    .then(influxToJSON)
    .then((list) => list.length);
}

function query(measurement, field, value) {
  return influx
    .query(measurement)
    .where(field, value)
    .then(influxToJSON);
}

function remove(measurement, field, value) {
  return request({
    method: 'POST',
    uri: `http://${db.username}:${db.password}@${db.host}:${db.port}/query`,
    form: {
      db: 'monitoring',
      q: `drop series from "${measurement}" where ${field}='${value}'`
    },
    json: true
  });
}

/// PUT
router.put('/api/renameSensor', function (req, res) {

  var body = req.body;

  if (typeof body.id === 'string' &&
    typeof body.idNew === 'string' &&
    body.idNew.trim() != '') {

    Promise.all([
      exists('Sensor', 'id', body.id),
      exists('Sensor', 'id', body.idNew)
    ])
      .then((values) => {
        if ( values[0] === 0 ) {
          return res.status(404).jsonp({ message: 'Sensor no encontrado' });
        }

        if ( values[0] > 1 ) {
          return res.status(500).jsonp({ message: 'Multiples sensores con el mismo ID' });
        }

        if ( values[1] > 0 ) {
          return res.status(403).jsonp({ message: 'Ya existe un sensor con ese ID' });
        }

        query('Sensor', 'id', body.id)
          .then((sensors) => {
            const sensor = sensors[0];
            sensor.id = body.idNew;

            remove('Sensor', 'id', body.id)
              .then(() => {
                influx
                  .write('Sensor')
                  .tag({
                    id: sensor.id,
					//host: sensor.host,
                  })
                  .field({
                    lat: sensor.lat,
                    lon: sensor.lon,
                    date: sensor.date,
                    auth: sensor.auth,
                  })
                  .then(() => res.status(200).jsonp({
                      message: `Sensor ${body.id} renombrado a ${body.idNew}`
                    }))
                  .catch((err) => {
                    console.log('/api/sensor ERROR: ', err);
                    return res.status(500).jsonp({ message: "No se pudo guardar el sensor" });
                  });
              })
              .catch((err) => {
                console.log('/api/renameSensor ERROR: ', err);
                return res.status(500).jsonp({ message: 'Error en la base de datos' });
              });

          })
          .catch((err) => {
            console.log('/api/renameSensor ERROR: ', err);
            return res.status(500).jsonp({ message: 'Error en la base de datos' });
          });

      })
      .catch((err) => {
        console.log('/api/renameSensor ERROR: ', err);
        return res.status(500).jsonp({ message: 'Error en la base de datos' });
      });
  } else {
    return res.status(400).jsonp({ message: "Error en el formato de los datos enviados" });
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
    exists('User', 'email', body.email)
      .then((cantUsers) => {
        if ( cantUsers === 0 ) {
          return res.status(404).jsonp({ message: 'Usuario no encontrado' });
        }

        if ( cantUsers > 1 ) {
          return res.status(500).jsonp({ message: 'Multiples usuarios con el mismo email' });
        }

        query('User', 'email', body.email)
          .then((users) => {
            const user = users[0];
            user.id = body.idNew;

            for (const i in user) {
              if ( user.hasOwnProperty(i) && body.hasOwnProperty(i) ) {
                user[i] = body[i];
              }
            }

            remove('User', 'email', body.email)
              .then(() => {
                influx
                  .write('User')
                  .tag(user)
                  .field(user)
                  .then(() => res.status(200).jsonp({ message: 'Usuario modificado' }))
                  .catch((err) => {
                    console.log('/api/sensor ERROR: ', err);
                    return res.status(500).jsonp({ message: "No se pudo guardar el usuario" });
                  });
              })
              .catch((err) => {
                console.log('/api/modifyUser ERROR: ', err);
                return res.status(500).jsonp({ message: 'Error en la base de datos' });
              });

          })
          .catch((err) => {
            console.log('/api/modifyUser ERROR: ', err);
            return res.status(500).jsonp({ message: 'Error en la base de datos' });
          });

      })
      .catch((err) => {
        console.log('/api/modifyUser ERROR: ', err);
        return res.status(500).jsonp({ message: 'Error en la base de datos' });
      });
  } else {
    return res.status(400).jsonp({ message: "Se requiere el email" });
  }

});

module.exports = function (app) {
  app.use('/', router);
};