/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ServiceSchema = new Schema({
  name  : { type: String, required: true },
});

mongoose.model('Service', ServiceSchema);