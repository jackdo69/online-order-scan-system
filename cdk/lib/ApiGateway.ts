import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { getBranchName } from "./helper";

export class ApiGateway extends RestApi {
  public static readonly ID = "Apigateway";

  constructor(private scope: Construct, apiName: string) {
    super(scope, "ApiGateway", {
      restApiName: `orderSystem_${getBranchName(scope)}`
    });
  }

  addIntegration(method: string, path: string, lambda: IFunction) {
    const ressource = this.root.resourceForPath(path);
    ressource.addMethod(method, new LambdaIntegration(lambda));
  }
}
