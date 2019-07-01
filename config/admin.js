var bcrypt = require('bcrypt-nodejs');
var STATE = require('./user_states');

module.exports = {
  SuperAdmin: {
    username : "root",
    category : "root",
    password : bcrypt.hashSync("yosoyelroot"),
    email: "root@root.com",
    phone: "00000000",
    name: '',
    age: -1,
    province: '',
    configured: true,
    state: STATE.ACTIVE
  },
  Admin: {
    username: "admin",
    category: "admin",
    password: bcrypt.hashSync("admin"),
    email: "admin@admin.com",
    phone: "00000001",
    name: '',
    age: -1,
    province: '',
    configured: true,
    state: STATE.ACTIVE
  }
};