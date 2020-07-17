# MVP CMS APIs

## About
This is a collection of API's that I created quickly for an MVP project/CMS that I was building.
Each API was written with NodeJS, ServerlessJS and deployed to AWS.
This is a group repo of what originally was a collection of smaller repo's each containing a single API.

## Setup and deployment
- First you will need to clone the repo to your local machine and in each directory run `npm install`.
- In order to get running, you will need to have AWS Cognito setup and update the UserPoolId and ClientID in both the Authentication services and Authoriser service.
- In order to deploy the API's, each will need to be deployed by running `sls deploy` in the root of each API directory.

All these steps should deploy the API's and create the DynamoDB tables for each respective API, if needed.

## What does all of this do?
This set of APIs provide functionality to,
- Register a new user
- Login a user
- Authorise ADMIN API endpoints
- Create, Read, Update and Delete Articles
- Create, Read, Update and Delete links to external content
- Create, Read, Update User profile details
- Create, Update Image uploading
- Register a user to an email list (register for news letters (This was incomplete)
