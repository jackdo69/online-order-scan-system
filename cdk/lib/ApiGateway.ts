import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { getBranchName } from "./helper";
import { Cognito } from "./Cognito";

export class ApiGateway extends RestApi {
  public static readonly ID = "Apigateway";
  private _authorizer: CognitoUserPoolsAuthorizer;

  constructor(private scope: Construct, apiName: string) {
    super(scope, "ApiGateway", {
      restApiName: `orderSystem_${getBranchName(scope)}`
    });
    const auth = new Cognito(scope);
    this._authorizer = auth.authorizer;
  }

  addIntegration(method: string, path: string, lambda: IFunction) {
    const ressource = this.root.resourceForPath(path);
    ressource.addMethod(method, new LambdaIntegration(lambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: this._authorizer
    });
  }
}
