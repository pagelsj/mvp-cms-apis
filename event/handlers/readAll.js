'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.readAll = (event, context, callback) => {
  // const params = JSON.parse(event.pathParameters);
  // console.log('params', params);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'publishedIndex',
    KeyConditionExpression:"#p = :p",
    ExpressionAttributeNames: {
      "#p":"published"
    },
    ExpressionAttributeValues: {
      ":p": "true",
    },
    ProjectionExpression: 'id, title, eventGeoLocation, eventDate, timeStart, timeEnd',
  };

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Couldn\'t fetch all articles.',
      });
    }

    // create a response
    const response = {
      "statusCode": 200,
      "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
