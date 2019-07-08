var bcrypt = require('bcrypt-nodejs');
var STATE = require('./user_states');

module.exports = {
  SuperAdmin: {
    fields: {
      username : "root",
      category : "root",
      password : bcrypt.hashSync("yosoyelroot"),
      phone: "00000000",
      name: 'root',
      age: -1,
      province: 'none',
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
      name: 'admin',
      age: -1,
      province: 'none',
      configured: true,
      state: STATE.ACTIVE
    },
    tags: {
      email: "admin@admin.com",
    }
  }
};