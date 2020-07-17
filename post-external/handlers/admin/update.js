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
      'id': data.id,
    },
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#title': 'title',
      '#synopsis': 'synopsis',
      '#articleUrl': 'articleUrl',
      '#published': 'published',
      '#tags': 'tags',
      '#category': 'category',
      '#image': 'image',
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':userId': data.userId,
      ':title': data.title,
      ':synopsis': ((data.synopsis) ? data.synopsis : null),
      ':articleUrl': ((data.articleUrl) ? data.articleUrl : null),
      ':published': data.published.toString(),
      ':tags': ((data.tags) ? data.tags : null),
      ':category': ((data.category) ? data.category : null),
      ':image': ((data.image) ? data.image : null),
      ':updatedAt': timestamp
    },
    UpdateExpression: 'set #userId = :userId, #title = :title, #synopsis = :synopsis, #articleUrl = :articleUrl, #published = :published, #tags = :tags, #category = :category, #image = :image, #updatedAt = :updatedAt',

    ReturnValues: 'NONE'
  };
  dynamoDb.update(params, (error, success) => {
    if (error) {
      console.log('ERROR: id', data.id);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: 'There was an error Updating the item. ' + JSON.stringify(error, null, 2),
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
