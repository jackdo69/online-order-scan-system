import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export const createLambda = (scope: Construct, fileName: string): NodejsFunction => {
  const lambda = new NodejsFunction(scope, fileName, {
    architecture: Architecture.ARM_64,
    runtime: Runtime.NODEJS_14_X,
    entry: path.join(__dirname, `../../backend/_lambda-handlers/${fileName}.ts`)
  });
  return lambda;
};
