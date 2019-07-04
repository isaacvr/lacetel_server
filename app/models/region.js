/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  name: 's',
};

const tagSchema = {
};

const name = 'Region';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};

// var mongoose = require('mongoose');
// var Schema   = mongoose.Schema;
// var RegionSchema = new Schema({
// name  : { type: String, required: true },
// });
// mongoose.model('Region', RegionSchema);