'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      email: data.email
    },
  };


  dynamoDb.put(params, (error) => {
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
	      'Access-Control-Allow-Origin': '*'
	    },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};