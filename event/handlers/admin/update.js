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
      '#about': 'about',
      '#price': 'price',
      '#eventLocation': 'eventLocation',
      '#eventGeoLocation': 'eventGeoLocation',
      '#date': 'eventDate',
      '#timeStart': 'timeStart',
      '#timeEnd': 'timeEnd',
      '#speaker': 'speaker',
      '#capacity': 'eventCapacity',
      '#tags': 'tags',
      '#image': 'image',
      '#published': 'published',
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':userId': data.userId,
      ':title': data.title,
      ':about': data.about,
      ':price': data.price,
      ':eventLocation': data.eventLocation,
      ':eventGeoLocation': data.eventGeoLocation,
      ':date': data.eventDate,
      ':timeStart': data.timeStart,
      ':timeEnd': data.timeEnd,
      ':speaker': data.speaker,
      ':capacity': data.eventCapacity,
      ':tags': data.tags,
      ':image': data.image,
      ':published': data.published.toString(),
      ':updatedAt': timestamp
    },
    UpdateExpression: 'set #userId = :userId, #title = :title, #about = :about, #price = :price, #eventLocation = :eventLocation, #eventGeoLocation = :eventGeoLocation, #date = :date, #timeStart = :timeStart, #timeEnd = :timeEnd, #speaker = :speaker, #capacity = :capacity, #tags = :tags, #published = :published, #image = :image, #updatedAt = :updatedAt',
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
