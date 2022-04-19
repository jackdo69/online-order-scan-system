import { RemovalPolicy } from "aws-cdk-lib";
import {
  AccessLogField as al,
  AccessLogFormat,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LogGroupLogDestination,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { Cognito } from "./Cognito";
import { getBranchName } from "./helper";

export class ApiGateway extends RestApi {
  public static readonly ID = "Apigateway";
  private _authorizer: CognitoUserPoolsAuthorizer;

  constructor(private scope: Construct, apiName: string) {
    super(scope, "ApiGateway", {
      restApiName: `orderSystem_${getBranchName(scope)}`,
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(
          new LogGroup(scope, `${apiName}`, {
            logGroupName: "apiGatewayLogGroup",
            retention: RetentionDays.ONE_DAY,
            removalPolicy: RemovalPolicy.DESTROY
          })
        ),
        accessLogFormat: AccessLogFormat.custom(
          `${al.contextIdentitySourceIp} ${al.contextIdentityCaller()} ${al.contextIdentityUser()} [${
            al.contextRequestTime
          }]${al.contextHttpMethod()} ${al.contextResourcePath} ${al.contextProtocol} ${al.contextStatus} ${al.contextResponseLength} ${
            al.contextRequestTimeEpoch
          }${al.contextRequestId()} `
        )
      }
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
