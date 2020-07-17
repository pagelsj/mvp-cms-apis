'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: data.client_id,
    },
    ExpressionAttributeNames: {
      '#email': 'email',
      '#given_name': 'given_name',
      '#family_name': 'family_name',
      '#website': 'website',
      '#dob': 'dob',
      '#bio': 'bio',
      '#image': 'image',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':email': data.email,
      ':given_name': data.given_name,
      ':family_name': data.family_name,
      ':website': data.website,
      ':dob': data.dob,
      ':bio': data.bio,
      ':image': data.image,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET #email = :email, #given_name = :given_name, #family_name = :family_name, #website = :website, #dob = :dob, #bio = :bio, #image = :image, #updatedAt = :updatedAt',
    ReturnValues: 'NONE',
  };

  dynamoDb.update(params, (error) => {
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'There was an error adding new insight to the DB. Try again later. ' + error,
      });
      return;
    }
    const response = {
      statusCode: 200,
	    headers: {
        "Content-Type": "application/json",
	      'Access-Control-Allow-Origin': '*'
	    },
      body: JSON.stringify({success: true}),
    };
    callback(null, response);
  });
};
