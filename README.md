# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

steps
- `npm i`
- `cdk deploy`

test lambda using:
```json
{
  "httpMethod": "POST",
  "body":{
    "releasedYear": "1994",
    "movieName": "The Shawshank Redemption",
    "ratings": 9.1
  }
}
```

test api gateway using:

POST method:
```json
{
  "releasedYear": "1972",
  "movieName": "The Godfather",
  "ratings": 9.0
}
```