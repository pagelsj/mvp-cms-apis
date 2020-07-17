const _ = require('lodash');
const utils = require('./utils/iam');
const jwt = require('jsonwebtoken');
const request = require('request');
const jwkToPem = require('jwk-to-pem');


// Returns a boolean whether or not a user is allowed to call a particular method
// A user with scopes: ['pangolins'] can
// call 'arn:aws:execute-api:ap-southeast-1::random-api-id/dev/GET/pangolins'
const authorizeUser = (userScopes, methodArn) => {
  console.log(`authorizeUser ${JSON.stringify(userScopes)} ${methodArn}`);
  const hasValidScope = _.some(userScopes, scope => _.endsWith(methodArn, scope));
  return hasValidScope;
};

/**
  * Authorizer functions are executed before your actual functions.
  * @method authorize
  * @param {String} event.authorizationToken - JWT
  * @throws Returns 401 if the token is invalid or has expired.
  * @throws Returns 403 if the token does not have sufficient permissions.
  */
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.authorize = (event, context, callback) => {
  const token = event.authorizationToken;

  request({
    url : `https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_{THIS NEEDS TO BE UPDATED}/.well-known/jwks.json`,
    json : true
  }, function(error, response, body){
    try {

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
        jwt.verify(token, pem, (err, decoded) => {
          if (err) {
            console.log('error: ', err);
            console.log('Unauthorized user:', err.message);
            // context.fail('Unauthorized');
            context.fail(generatePolicy('user', 'Deny', event.methodArn));
          } else {
            context.succeed(generatePolicy('user', 'Allow', '*'));
          }
        });
      } else {
        console.log("Error! Unable to download JWKs");
        return (error);
      }
    } catch (e) {
      console.log(e.message);
      context.fail(generatePolicy('user', 'Deny', event.methodArn));
      // context.fail('Unauthorized'); // Return a 401 Unauthorized response
    }
  });
};
