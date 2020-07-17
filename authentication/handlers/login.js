'use strict';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const UserPoolObj = require('../services/UserPoolObj');

module.exports.login = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const authenticationData = {
    Username : data.username,
    Password : data.password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  var poolData = {
    UserPoolId : '',
    ClientId : ''
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username : data.username,
    Pool : userPool
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log('result', result.idToken.payload['cognito:groups']);
      var accessToken = result.getAccessToken().getJwtToken();

      /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
      var idToken = result.idToken.jwtToken;
      var payload = {
        "accessToken": result.idToken.jwtToken,
        "name": result.idToken.payload.given_name,
        "lastname": result.idToken.payload.family_name,
        "client_id": result.idToken.payload["cognito:username"],
      };
      if (result.idToken.payload['cognito:groups'])
        payload['group'] = result.idToken.payload['cognito:groups'];


      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(payload),
      };
      callback(null, response);
    },

    onFailure: function(err) {
      console.log(err);
      callback(err);
    }

  });

};
