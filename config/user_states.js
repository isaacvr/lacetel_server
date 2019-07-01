module.exports = (function() {

  var obj = {};

  obj[obj.ACTIVE = 1] = 'ACTIVE';
  obj[obj.INACTIVE = 2] = 'INACTIVE';
  obj[obj.PENDING = 3] = 'PENDING';

  return obj;

}());