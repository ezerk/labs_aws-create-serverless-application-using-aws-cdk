import * as cdk from '@aws-cdk/core';

import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as path from 'path';

export class ServerlessCdkAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // code to create moviesTable dynamodb table
    const moviesTable = new dynamodb.Table(this, ' moviesTable', {
      tableName: `movies-table`,
      partitionKey: { name: 'year', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'movieName', type: dynamodb.AttributeType.STRING },
      readCapacity: 2,
      writeCapacity: 2,
      // removalPolicy: RemovalPolicy.DESTROY,
    });
    
    //code to add lambda function that queries the dynamodb table
    const ServerlessAPIFunction = new lambda.Function(this, 'ServerlessAPIFunction', {
      functionName: `ServerlessAPIFunction`,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      environment: { DYNAMODB_TABLE_NAME: moviesTable.tableName },
      code: lambda.Code.fromAsset(path.dirname('./functions/index.js')),
    });
    
    // code to add read and write permission of dynamodb table to lambda function
    moviesTable.grantReadWriteData(ServerlessAPIFunction);
    
    //add the API Gateway creation code below
    const serverlessApi = new apigateway.RestApi(this, "serverless-app-api", {
      restApiName: "Serverless app API",
      description: "This service serves as an API for the serverless app.."
    });
    
    //add the API Gateway lambda integration and method addition code below
    serverlessApi.root.addMethod("ANY", new apigateway.LambdaIntegration(ServerlessAPIFunction));
    
    //add code for the APIGateway url output below
    new cdk.CfnOutput(this, "HTTP API URL", {
      value:  serverlessApi.url ?? "Something went wrong with the deploy",
    });
  }
}
