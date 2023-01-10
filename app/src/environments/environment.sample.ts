// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  amplify: {
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: 'ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      // REQUIRED - Amazon Cognito Region
      region: 'ap-northeast-1',
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'ap-northeast-1_xxxxxxxxx',
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
      // ユーザープールのエンドポイントの変更
      // https://cognito-idp.ap-northeast-1.amazonaws.com
      endpoint: 'http://localhost:8080/auth-idp/',
    },
    API: {
      endpoints: [
        {
          name: 'api',
          endpoint: 'http://localhost:8080/api',
        },
      ],
    },
  },
  cognito: {
    userPoolEndpoint: 'http://localhost:8080/auth-idp/',
    idPoolHostname: 'localhost:8080/auth-ide',
    idPoolProtocol: 'http:',
  },
  api: {
    proxyHostPath: 'localhost:8080/api',
    apiGatewayHostPath:
      'xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
