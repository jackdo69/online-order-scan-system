import {
  AccessLogFormat,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  LogGroupLogDestination,
  MethodOptions,
  RestApi,
  AccessLogField as al
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { getBranchName } from "./helper";
import { Cognito } from "./Cognito";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";

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
            retention: RetentionDays.ONE_WEEK,
            removalPolicy: RemovalPolicy.DESTROY
          })
        ),
        metricsEnabled: true,
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
