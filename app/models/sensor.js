/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  lat: 'f',
  lon: 'f',
  date: 's',
  auth: 'b',
};

const tagSchema = {
  id: '*',
  host: ['WEB', 'SENSOR'],
};

const name = 'Sensor';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};