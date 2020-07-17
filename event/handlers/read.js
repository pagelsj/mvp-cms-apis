'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.read = (event, context, callback) => {
  // const params = JSON.parse(event.pathParameters);
  // console.log('params', params);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    // Key: {
    //   title: event.pathParameters.title
    // }
    IndexName: 'titleIndex',
    KeyConditionExpression: "#title = :title",
    ExpressionAttributeNames: {
      '#title': 'title'
    },
    ExpressionAttributeValues: {
      ':title' : decodeURI(event.pathParameters.title)
    },
    ProjectionExpression: 'id, userId, image, title, about, price, eventLocation, eventGeoLocation, eventDate, timeStart, timeEnd, speaker, eventCapacity, published, registered, tags, updatedAt',
  };

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'Couldn\'t fetch the article item.',
      });
    }

    console.log('result', result);
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
