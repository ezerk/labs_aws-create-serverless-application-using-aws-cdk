#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerlessCdkAppStack } from '../lib/serverless-cdk-app-stack';

const app = new cdk.App();
new ServerlessCdkAppStack(app, 'ServerlessCdkAppStack', {
  
});
