import { RemovalPolicy } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { AccountRecovery, UserPool, UserPoolClientIdentityProvider } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class Cognito {
  private _userPool: UserPool;
  private _authorizer: CognitoUserPoolsAuthorizer;

  constructor(private scope: Construct) {
    this._userPool = new UserPool(scope, "user-pool", {
      userPoolName: "online-order-system",
      removalPolicy: RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY
    });

    this._userPool.addClient("user-pool-client", {
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
    });

    this._authorizer = new CognitoUserPoolsAuthorizer(scope, "user-pool-authorizer", {
      authorizerName: "user-pool-authorizer",
      cognitoUserPools: [this._userPool]
    });
  }

  public get authorizer() {
    return this._authorizer;
  }
}
