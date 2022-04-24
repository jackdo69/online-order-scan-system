import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { createLambda } from "./helper";
import { ApiGateway } from "./ApiGateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class OnlineOrderScanSystemStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { ...props });
    //Create lambdas
    const health = createLambda(this, "health");
    const createOrder = createLambda(this, "createOrder");

    //Create api gateway
    const api = new ApiGateway(this, "apigateway");

    api.addIntegration("GET", "/health", health);
    api.addIntegration("POST", "/order", createOrder);

    // Create dynamo table
    new Table(this, "order-system-db", {
      partitionKey: { name: "composite_id", type: AttributeType.STRING },
      tableName: "order-system-db"
    });
  }
}
