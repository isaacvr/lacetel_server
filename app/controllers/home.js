/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

// var mongoose  = require('mongoose');
var adminConf = require('../../config/admin');

// var express    = require('express');
// var router     = express.Router();

// var path       = require('path');
//var fs         = require('fs');
//var bcrypt     = require('bcrypt-nodejs');
//var moment     = require('moment');
//var multer     = require('multer');
//var service    = require('../../auth/tokenService');
//var STATES     = require('../../config/user_states');

var Admin      = adminConf.Admin;
var SuperAdmin = adminConf.SuperAdmin;

// mongoose.Promise = require('bluebird');

// var rootPath = path.normalize(__dirname + '/../../');

// var authProvider = require('../../auth');
// var ensureAuthenticated = authProvider.ensureAuthenticated;
// var ensureAdmin = authProvider.ensureAdmin;

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(rootPath, '/public/img'))
//   },
//   filename: function (req, file, cb) {
//     var parts = file.originalname.split('.');
//     var ext = parts[ parts.length - 1 ];

//     cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
//   }
// })

// var upload = multer({ storage: storage });

// var User = mongoose.model('User');

var Influx = require('influxdb-nodejs');
// var bcrypt = require('bcrypt-nodejs');
var config = require('../../config/config');

const db = config.db;
const influx = new Influx(`http://${db.host}:${db.port}/${db.database}`);

influx
  .query('User')
  .where('username', 'root')
  .then((results) => {

    const res = results.results;

    if ( !( res.length >= 1 && res[0].series ) ) {
      influx
        .write('User')
        .tag(SuperAdmin.tags)
        .field(SuperAdmin.fields)
        .then(() => {})
        .catch((err) => {
          console.log(err);
          console.log('ROOT ERROR');
        })
    }
  })
  .catch(() => {});

influx
  .query('User')
  .where('category', 'admin')
  .then((results) => {

    const res = results.results;

    if ( !( res.length >= 1 && res[0].series ) ) {
      influx
        .write('User')
        .tag(Admin.tags)
        .field(Admin.fields)
        .then(() => {})
        .catch((err) => {
          console.log(err);
          console.log('ADMIN ERROR');
        });
    }
  })
  .catch((err) => { console.log('ADMIN ERROR', err); });

/// Create the ROOT Superadmin
// user
//   .findOne({
//     category : "root"
//   }, function(err, user) {
//     //console.log('ERR, USER: ', err, user);
//     if ( !!err || (!err && !user) ) {
//       var root = new User(SuperAdmin);
//       root.save();
//     }
//   });

// /// Create the initial admin
// user
//   .findOne({
//     category : "admin"
//   }, function(err, user) {
//     if ( !!err || (!err && !user) ) {
//       var admin = new User(Admin);
//       admin.save();
//     }
//   });

module.exports = () => {};