'use strict';

global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const UserPoolObj = require('../services/UserPoolObj');

module.exports.register = (event, context, callback) => {
  const data = JSON.parse(event.body);

  var poolData = {
    UserPoolId : '',
    ClientId : ''
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  // var userData = {
  //   Username : data.username,
  //   Pool : userPool
  // };

	var attributeList = [];

	var dataEmail = {
	    Name: 'email',
	    Value: data.username,
	};
	var dataFamilyName = {
	    Name: 'family_name',
	    Value: data.lastname,
	};
	var dataGivenName = {
	    Name: 'given_name',
	    Value: data.firstname,
	};

	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributeFamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFamilyName);
	var attributeFirstName = new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName);

	attributeList.push(attributeEmail);
	attributeList.push(attributeFamilyName);
	attributeList.push(attributeFirstName);

	userPool.signUp(data.username, data.password, attributeList, null, function(
	    err,
	    result
	) {
	    if (err) {
	        let errorMessage = err.message || JSON.stringify(err);

	        callback(errorMessage);
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



