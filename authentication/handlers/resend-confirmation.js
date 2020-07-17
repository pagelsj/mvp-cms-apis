'use strict';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const UserPoolObj = require('../services/UserPoolObj');

module.exports.resendConfirmation = (event, context, callback) => {
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

  cognitoUser.resendConfirmationCode(function(err, result) {
		if (err) {
			callback(err);
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



