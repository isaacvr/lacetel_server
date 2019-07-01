/**
 * @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

/**
 *
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next middleware handler
 * @returns {void} Returns nothing
 */
function logger(req, res, next) {

  console.log(req);

  next();

}

module.exports = logger;