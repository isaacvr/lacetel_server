/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var config = require('./config/config');
var Influx = require('influxdb-nodejs');
var moment = require('moment');
//var mongoose = require('mongoose');
//var https    = require('https');
//var fs       = require('fs');

// var httpsOptions = {
//   key: fs.readFileSync('./config/server.key'),
//   cert: fs.readFileSync('./config/server.cert')
// };

let db = config.db;

let influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

influx.showDatabases()
  .then((names) => {
    if ( !names.includes('signals') ) {
      return influx.createDatabase('signals');
    }
  })
  .then(() => {
    console.log('Conectado a la base de datos!');

    loadSignalLevel(10000)
      .then(() => {
        console.log('MIGRATIONS DONE!!!');
      });

  })
  .catch((err) => {
    switch(err.code) {
      case 'ENOTFOUND': {
        console.error('No se encontró la base de datos en esa ubicación, por favor verifique');
        break;
      }
      default:
        console.log(err);
        console.error('No se pudo establecer comunicación con la base de datos');
    }
  });

function genRandom() {
  return Math.random().toString().split('.')[1];
}

function loadSignalLevel(total) {

  var signal_level = (function() {
    var _sign = [];

    var cant = total || 1000;

    for (let i = 0; i < cant; i += 1) {
      _sign.push([null, null, null, Math.floor((-90 + Math.random() * 50) * 100) / 100, 2, 0, 0]);
    }

    return _sign;

  }());

  console.log('LOADING SIGNAL LEVELS');

  return new Promise((resolve, reject) => {

    var i = 0;
    var maxi = signal_level.length;
    var itv;

    itv = setInterval(() => {

      if ( i >= maxi ) {
        clearInterval(itv);
        console.log('SIGNAL LEVELS LOADED');
        return resolve(null);
      }

      influx
        .write('SignalLevel')
        .tag({
          sensor: Math.floor( Math.random() * 5 )
        })
        .field({
          date: +moment().format('x'),
          value: signal_level[i][3],
          frequency: signal_level[i][5],
          service: signal_level[i][6]
        })
        .then(() => {})
        .catch((err) => {
          console.log('LoadSignals ERROR: ', err);
        })

      i += 1;
    }, 2000);

  });

}

/*function loadSensors() {

  console.log('LOADING SENSORS');

  //var Sensor = mongoose.model('Sensor');

  var sensors = [
    [ 21.8601, -438.6626, -90 ],
    [ 22.3601, -440.6626, -70 ],
    [ 20.3601, -435.6626, -45 ],
    [ 22.3601, -443.6626, -20 ]
  ];

  sensors.forEach(function(e) {

    var sensor = new Sensor({
      id: genRandom(),
      lat: e[0],
      lon: e[1],
      val: e[2]
    });

    sensor.save();

  });

  console.log('SENSORS LOADED');

}//*/