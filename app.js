/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var express  = require('express');
var config   = require('./config/config');
// var glob     = require('glob');
var Influx   = require('influxdb-nodejs');
// var mongoose = require('mongoose');
// var https    = require('https');
// var fs       = require('fs');

// var httpsOptions = {
//   key: fs.readFileSync('./config/server.key'),
//   cert: fs.readFileSync('./config/server.cert')
// };

const db = config.db;

const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

influx.showDatabases()
  .then((names) => {
    if ( !names.includes('signals') ) {
      return influx.createDatabase('signals');
    }
  })
  .then(() => {
    console.log('Conectado a la base de datos!');

    var models = glob.sync(config.root + '/app/models/*.js');

    models.forEach(function (model) {
      require(model)(influx);
    });

    var app = express();

    module.exports = require('./config/express')(app, config);

    //https.
    //  createServer(httpsOptions, app).
    app
      .listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });
  })
  .catch((err) => {
    switch (err.code) {
      case 'ENOTFOUND': {
        console.error('No se encontró la base de datos en esa ubicación, por favor verifique');
        break;
      }
      default:
        console.log(err);
        console.error('No se pudo establecer comunicación con la base de datos');
    }
  });