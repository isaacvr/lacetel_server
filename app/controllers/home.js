/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var adminConf = require('../../config/admin');

var Admin      = adminConf.Admin;
var SuperAdmin = adminConf.SuperAdmin;
var Influx = require('influxdb-nodejs');
var config = require('../../config/config');
var influxToJSON = require('../utils/influx-to-json');

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

influx
  .query('User')
  .where('username', 'root')
  .then(influxToJSON)
  .then((users) => {

    if ( users.length === 0 ) {
      influx
        .write('User')
        .tag(SuperAdmin.tags)
        .field(SuperAdmin.fields)
        .then(() => {
          console.log('CREATED ROOT');
        })
        .catch((err) => {
          console.log(err);
          console.log('ROOT ERROR');
        })
    }
  })
  .catch(() => {});

influx
  .query('User')
  .where('category', ['admin', 'superadmin'])
  .then(influxToJSON)
  .then((users) => {

    if ( users.length === 0 ) {
      influx
        .write('User')
        .tag(Admin.tags)
        .field(Admin.fields)
        .then(() => {
          console.log('CREATED ADMIN');
        })
        .catch((err) => {
          console.log(err);
          console.log('ADMIN ERROR');
        });
    }
  })
  .catch((err) => { console.log('ADMIN ERROR', err); });

module.exports = () => {};