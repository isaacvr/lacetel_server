/**
 * @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

module.exports = function objectPath(obj, path, returnDefault) {
  if ( path.length === 0 ) {
    return obj;
  }

  if ( !obj.hasOwnProperty(path[0]) ) {
    return returnDefault;
  }

  return objectPath(obj[path[0]], path.slice(1, path.length), returnDefault || []);
};