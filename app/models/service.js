/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  name: 's',
};

const tagSchema = {
};

const name = 'Service';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};

/*var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ServiceSchema = new Schema({
  name  : { type: String, required: true },
});

mongoose.model('Service', ServiceSchema);*/