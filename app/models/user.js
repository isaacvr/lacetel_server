/**
 *  @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

const fieldSchema = {
  name: 's',
  username: 's',
  email: 's',
  password: 's',
  configured: 'b',
  age: 'i',
  phone: 's',
  province: 's',
  state: 'i',
  category: 's',
};

const tagSchema = {
};

const name = 'User';

module.exports = function(influx) {
  influx.schema(name, fieldSchema, tagSchema, {
    stripUnknown: true,
  });
};

// var UserSchema = new Schema({
// name: {
// type: String,
// default: ''
// },
// username: {
// type: String,
// default: ''
// },
// email: {
// type: String,
// required: true,
// unique: true,
// //match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// },
// password: {
// type: String,
// required: true
// },
// age: {
// type: Number,
// default: -1
// },
// phone: {
// type: String,
// default: ''
// },
// province: {
// type: String,
// default: ''
// },
// configured: {
// type: Boolean,
// default: false
// },
// state: {
// type: Number,
// default: STATES.PENDING,
// enum: [ STATES.ACTIVE, STATES.INACTIVE, STATES.PENDING ]
// },
// category: {
// type: String,
// required: true,
// enum: [].concat(Categories)
// },
// });
// mongoose.model('User', UserSchema);//