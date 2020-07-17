'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.readAll = (event, context, callback) => {
  // const params = JSON.parse(event.pathParameters);
  // console.log('params', params);

  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };

  // fetch todo from the database
  dynamoDb.scan(params, (error, result) => {
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


    const resp = [];

    if(result && result.Items.length) {
      result.Items.forEach(item => {
        item['external'] = true;
        resp.push(item);
      });
    }
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
