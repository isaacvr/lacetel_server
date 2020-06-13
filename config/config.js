/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var path     = require('path');
var rootPath = path.join(__dirname, '/..');
var env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'lacetel-monitoring'
    },
    port: process.env.PORT || 4000,
    db: {
      host: '192.168.255.129',
      port: 8086,
      database: 'monitoring',
	  username: 'web',
	  password: 'Lacetel123'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'lacetel-monitoring'
    },
    port: process.env.PORT || 3000,
    db: {
      host: '127.0.0.1',
      port: 8086,
      database: 'lacetel'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'lacetel-monitoring'
    },
    port: process.env.PORT || 3000,
    db: {
      host: '127.0.0.1',
      port: 8086,
      database: 'lacetel'
    }
  }
};

module.exports = config[env];