'use strict';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const UserPoolObj = require('../services/UserPoolObj');

module.exports.confirm = (event, context, callback) => {
  const data = JSON.parse(event.body);

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

  cognitoUser.confirmRegistration(data.pin, true, function(err, result) {
    if (err) {
      console.log(JSON.stringify(err));
      callback(err);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result),
    };

    callback(null, response);
  });

};
