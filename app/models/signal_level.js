/**
 *  @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  date: 'i',
  value: 'i',
  frequency: 'i',
  service: 'i',
};

const tagSchema = {
  sensor: 'i',
};

const name = 'SignalLevel';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};