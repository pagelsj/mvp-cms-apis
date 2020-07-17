'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.readTag = (event, context, callback) => {

  try {

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      IndexName: 'publishedIndex',
      KeyConditionExpression: "#p = :p",
      FilterExpression: "contains(#t, :t)",
      ExpressionAttributeNames: {
        "#p": "published",
        "#t": "tags"
      },
      ExpressionAttributeValues: {
        ":p": "true",
        ":t": decodeURI(event.pathParameters.title)
      },
      ProjectionExpression: 'id, title, synopsis, slug, articleUrl, tags, category, rating, updatedAt',
    };


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
  } catch (e) {
    console.log('e', e);
  }
};
