/**
 * @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var objPath = require('./object-path');

module.exports = function influxToJSON(data) {

  console.log('data: ', data);

  var newData = {};

  if ( data.results ) {
    newData = objPath(data, ['results', '0', 'series', '0']);
  } else {
    newData = data;
  }

  console.log('newData: ', data);

  if ( !newData ) {
    return [];
  }

  const result = [];
  const cols = newData.columns || [];
  const values = newData.values || [];

  for (let i = 0, maxi = values.length; i < maxi; i += 1) {
    const obj = {};
    for (let j = 0, maxj = cols.length; j < maxj; j += 1) {
      obj[cols[j]] = values[i][j];
    }

    result.push(obj);
  }

  return result;


};