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
      '#title': 'title',
      '#p': 'published'
    },
    ExpressionAttributeValues: {
      ':title' : decodeURI(event.pathParameters.title),
      ':p': 'true'
    },
    ProjectionExpression: 'id, userId, title, synopsis, articleUrl, published, image, tags, category, updatedAt',
    FilterExpression: '#p = :p'
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

    const resp = [];

    if(result && result.Items.length) {
      result.Items.forEach(item => {
        item['external'] = true;
        resp.push(item);
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
      "body": JSON.stringify(resp),
    };
    callback(null, response);
  });
};
