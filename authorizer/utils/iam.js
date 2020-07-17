const jwt = require('jsonwebtoken');
const request = require('request');
const jwkToPem = require('jwk-to-pem');


/**
* Authorizer functions are executed before your actual functions.
* @method authorize
* @param {String} event.authorizationToken - JWT
* @throws Returns 401 if the token is invalid or has expired.
* @throws Returns 403 if the token does not have sufficient permissions.
*/
module.exports.verify = (token) => {

  request({
    url : `https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_{THIS NEEDS TO BE UPDATED}/.well-known/jwks.json`,
    json : true
  }, function(error, response, body){

    const responseCallback = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('error', error);
    console.log('response', response);
    console.log('body', body);


    if (!error && response.statusCode === 200) {

      pems = {};
      var keys = body['keys'];
      for(var i = 0; i < keys.length; i++) {
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent};
        var pem = jwkToPem(jwk);

        pems[key_id] = pem;
      }


      var decodedJwt = jwt.decode(token, {complete: true});
      if (!decodedJwt) {
        console.log("Not a valid JWT token");
        return (new Error('Not a valid JWT token'));
      }
      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        console.log('Invalid token');
        return (new Error('Invalid token'));
      }
      jwt.verify(token, pem, function(err, payload) {
        if(err) {
          console.log('err1', err);
          console.log("Invalid Token.");
          return (new Error('Invalid token'));
        } else {
          console.log('payload', payload);
          return payload;
        }
      });
    } else {
      console.log("Error! Unable to download JWKs");
      return (error);
    }
  });


};
