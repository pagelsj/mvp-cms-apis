'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.readAll = (event, context, callback) => {
  let cat = "#p = :p";

  if(event.pathParameters && event.pathParameters.title){
    cat = 'category = :c AND #p = :p';
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'publishedIndex',
    KeyConditionExpression: cat,
    ExpressionAttributeNames: {
      "#p": "published"
    },
    ExpressionAttributeValues: {
      ":p": "true"
    },
    ProjectionExpression: 'id, title, slug, synopsis, tags, category, rating, updatedAt',
  };

  if(event.pathParameters && event.pathParameters.title){
    params.ExpressionAttributeValues[':c'] = decodeURI(event.pathParameters.title);
    params.ProjectionExpression = params.ProjectionExpression += ', intro';
  }

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    console.log('error', error);
    console.log('result', result);

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
