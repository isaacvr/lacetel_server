/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var SensorSchema = new Schema({
  id      : { type: String, required: true, unique: true }, /// Identificador
  lat     : { type: Number,                              }, /// Latitud
  lon     : { type: Number,                              }, /// Longitud
  val     : { type: Number                               }, /// Ultimo valor de señal conocido
  lastSeen: { type: Date                                 }, /// Ultima fecha de registro
  auth    : { type: Boolean                              }, /// Si está autorizado o no el sensor
});

mongoose.model('Sensor', SensorSchema);