module.exports.UserPoolObj = (data) => {

	var poolData = {
    UserPoolId : 'eu-west-2_zJHaV517y',
    ClientId : '5jnveescgjucho7ppbagplupgs'
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username : data.username,
    Pool : userPool
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return cognitoUser;
};
