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
      about: data.about,
      price: data.price,
      tags: data.tags,
      image: (data.image) ? data.image : "null",
      eventLocation: data.eventLocation,
      eventGeoLocation: data.eventGeoLocation,
      eventDate: data.eventDate,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      speaker: data.speaker,
      eventCapacity: data.eventCapacity,
      registered: 0,
      published: (data.published) ? data.published.toString() : "false",
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
