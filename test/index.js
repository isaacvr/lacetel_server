/**
 * @author Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var chai        = require('chai');
var chaiHttp    = require('chai-http');
var express     = require('express');
var config      = require('../config/config');
var createToken = require('../auth/tokenService').createToken;

var app = express();

chai.use(chaiHttp);

var expect = chai.expect;

require(config.root + '/app/controllers/home')(app);
require(config.root + '/app/controllers/get')(app);
require(config.root + '/app/controllers/post')(app);

//var controllers = glob.sync(config.root + '/app/controllers/*.js');

// controllers.forEach(function (controller) {
//   require(controller)(app);
// });

var ADMIN_TOKEN = createToken({
  name: 'admin',
  username: 'admin',
  email: 'root@root.com',
  category: 'admin',
});

var MODERATOR_TOKEN = createToken({
  name: 'mod',
  username: 'mod',
  email: 'root@root.com',
  category: 'moderador',
});

var USER_TOKEN = createToken({
  name: 'user',
  username: 'user',
  email: 'root@root.com',
  category: 'user',
});

/// GET
describe('GET /api/users', function() {
  it('Should return unauthorized without token', function(done) {
    chai
      .request(app)
      .get('/api/users')
      .set({
        'Accept': 'application/json'
      })
      .end(function(err, res) {
        // console.log('Without AUTH', res.text);
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should return unauthorized with user token', function(done) {
    chai
      .request(app)
      .get('/api/users')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ThisIsMyFakeToken`
      })
      .end(function(err, res) {
        // console.log('Width USER AUTH', res.text);
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done(err);
      });
  });

  it('Should return unauthorized with user token', function(done) {
    chai
      .request(app)
      .get('/api/users')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ${USER_TOKEN}`
      })
      .end(function(err, res) {
        // console.log('Width USER AUTH', res.text);
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done(err);
      });
  });

  it('Should return a list of users with moderator token', function(done) {
    chai
      .request(app)
      .get('/api/users')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ${MODERATOR_TOKEN}`
      })
      .end(function(err, res) {
        // console.log('Width MOD AUTH', res.text);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done(err);
      });
  });

  it('Should return a list of users with admin token', function(done) {
    chai
      .request(app)
      .get('/api/users')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ${ADMIN_TOKEN}`
      })
      .end(function(err, res) {
        // console.log('Width ADMIN AUTH', res.text);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-type', /json/);
        done(err);
      });
  });

});

describe('GET /api/user/:username', function() {
  it('Should return data only for authenticated users', function(done) {
    chai
      .request(app)
      .get('/api/user/root@root.com')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should not see the root', function(done) {
    chai
      .request(app)
      .get('/api/user/root@root.com')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ${USER_TOKEN}`
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should get the default admin', function(done) {
    chai
      .request(app)
      .get('/api/user/admin@admin.com')
      .set({
        'Accept': 'application/json',
        'Authorization': `Token ${USER_TOKEN}`
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-type', /json/);
        done();
      });
  });

});

describe('GET /api/signals', function() {
  /// Without token
  /// With token
  /// return something
  /// return nothing

  it('Should return unauthorized', function(done) {
    chai
      .request(app)
      .get('/api/signals')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should return something with authorized token', function(done) {
    chai
      .request(app)
      .get('/api/signals')
      .set({
        'Authorization': `Token ${USER_TOKEN}`
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-type', /json/);
        done();
      });
  });//*/

});

// describe('GET /api/sensors', function() {});