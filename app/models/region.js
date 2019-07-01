/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RegionSchema = new Schema({
  name  : { type: String, required: true },
});

mongoose.model('Region', RegionSchema);