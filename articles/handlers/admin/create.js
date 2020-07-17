'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      userId: data.userId,
      slug: encodeURI(data.title),
      title: data.title,
      intro: data.intro,
      body: data.body,
      image: data.image,
      tags: data.tags,
      category: data.category,
      published: (data.published) ? data.published.toString() : 'false',
      rating: 0,
      views: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    },
  };


  dynamoDb.put(params, (error) => {
    if (error) {
      console.log('error', error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'There was an error adding new article insight to the DB. Try again later. ' + error,
      });
      return;
    }
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
