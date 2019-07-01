/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var TOKEN_SECRET = require('../config/token');

function createToken(user) {

  console.log('USER FOR TOKEN: ', user);

  var payload = {
    sub: {
      name: user.name,
      username: user.username,
      email: user.email,
      age: user.age,
      phone: user.phone,
      province: user.province,
      configured: user.configured,
      authorized: user.authorized,
      category: user.category,
    },
    iat: moment().unix(),
    exp: moment().add(20, 'm').unix()
  };

  //console.log('Payload: ', payload, '\nToken: ', TOKEN_SECRET);

  console.log('TOKEN GENERATED: ', jwt.encode(payload, TOKEN_SECRET));

  return jwt.encode(payload, TOKEN_SECRET);

}

module.exports = {
  createToken
};