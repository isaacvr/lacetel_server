var bcrypt = require('bcrypt-nodejs');
var STATE = require('./user_states');

module.exports = {
  SuperAdmin: {
    fields: {
      username : "root",
      category : "root",
      password : bcrypt.hashSync("yosoyelroot"),
      phone: "00000000",
      name: '',
      age: -1,
      province: '',
      configured: true,
      state: STATE.ACTIVE
    },
    tags: {
      email: "root@root.com",
    }
  },
  Admin: {
    fields: {
      username: "admin",
      category: "admin",
      password: bcrypt.hashSync("admin"),
      phone: "00000001",
      name: '',
      age: -1,
      province: '',
      configured: true,
      state: STATE.ACTIVE
    },
    tags: {
      email: "admin@admin.com",
    }
  }
};