/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TransmitterSchema = new Schema({
  name  : { type: String, required: true },
  region: { type: String, required: true },
  id    : { type: String, required: true }
});

mongoose.model('Transmitter', TransmitterSchema);