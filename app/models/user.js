/**
 *  @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  name: 's',
  username: 's',
  // email: 's',
  password: 's',
  configured: 'b',
  age: 'i',
  phone: 's',
  province: 's',
  state: 'i',
  category: 's',
};

const tagSchema = {
  email: '*',
};

const name = 'User';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};

// match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/