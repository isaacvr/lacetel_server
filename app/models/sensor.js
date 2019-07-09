/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  lat: 'i',
  lon: 'i',
  val: 'i',
  lastSeen: 's',
  auth: 'b',
};

const tagSchema = {
  id: '*',
};

const name = 'Sensor';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};