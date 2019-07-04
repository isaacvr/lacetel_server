/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  name: 's',
  region: 's',
  id: 's',
};

const tagSchema = {
};

const name = 'Transmitter';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};