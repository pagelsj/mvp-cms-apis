'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.delete = (event, context, callback) => {
  const data = JSON.parse(event.body);
  let encodedImage = data.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
  let decodedImage = Buffer.from(encodedImage, 'base64');

  const filePath = data.path + "/" + data.filename + ".jpeg"

  const deleteObject = {
    "Bucket": "iamarla-uploads",
    "Key": data.image
  };

  s3.deleteObject(deleteObject, function(err, data){
    let response;

    if(err) {
      response = {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the profile item.',
      };

    } else {
      response = {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(data),
        "isBase64Encoded": false
      };
    }
    callback(null, response);

  });

};
