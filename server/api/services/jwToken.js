/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var Hashids = require('hashids');
var hashids = new Hashids();
var id = hashids.encode(1, 2, 3)
var secretToken = id;

let
  jwt = require('jsonwebtoken'),
  tokenSecret = secretToken;

let jwToken = {};
/* Generates a token from supplied payload */

jwToken.issue = (payload) => {
  return jwt.sign(
    payload,
    tokenSecret, // Token Secret that we sign it with
    {
      expiresIn: 60 * 60 * 5, // Token Expire time  expires in 300 minute
      issuer: 'QValidator',
      audience: 'QValidator'
    }
  );
};

/* Verifies token on a request */
jwToken.verify = (token, callback) => {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {},
    callback //Pass errors or decoded token to callback
  );
};

module.exports = jwToken;