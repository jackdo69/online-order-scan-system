import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

export const createLambda = (scope: Construct, fileName: string): NodejsFunction => {
  const lambda = new NodejsFunction(scope, fileName, {
    architecture: Architecture.ARM_64,
    runtime: Runtime.NODEJS_14_X,
    entry: path.join(__dirname, `../../backend/_lambda-handlers/${fileName}.ts`),
    logRetention: RetentionDays.ONE_DAY
  });

  lambda.addToRolePolicy(
    new PolicyStatement({
      resources: ["*"],
      actions: [
        "dynamodb:GetItem",
        "dynamodb:DeleteItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:BatchWriteItem",
        "dynamodb:BatchGetItem",
        "dynamodb:DescribeTable",
        "dynamodb:ConditionCheckItem",
        "dynamodb:UpdateItem"
      ]
    })
  );
  return lambda;
};

export const getBranchName = (scope: Construct): string => {
  return scope.node.tryGetContext("branchName") ?? "";
};
