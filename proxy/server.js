const express = require('express');
const cors = require('cors');
const app = express();
const AWS = require('aws-sdk');
const proxy = require('proxy-agent');

// サーバー起動
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// AWS設定
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
});
AWS.config.update({
  region: 'ap-northeast-1',
  credentials: credentials,
  // httpOptions: { agent: proxy(process.env.PROXY_URL) },
});

app.get('/', (req, res) => {
  res.send('It works!');
});

// 以下のURLに対する処理の定義
// https://cognito-idp.ap-northeast-1.amazonaws.com
app.post('/auth-idp', (req, res) => {
  const target = req.get('X-Amz-Target');
  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

  if (target === 'AWSCognitoIdentityProviderService.InitiateAuth') {
    const params = {
      AuthFlow: req.body.AuthFlow,
      ClientId: req.body.ClientId,
      AuthParameters: req.body.AuthParameters,
    };
    cognitoIdp.initiateAuth(params, function (err, data) {
      if (err) console.log(err, err.stack);
      res.json(data);
    });
  } else if (
    target === 'AWSCognitoIdentityProviderService.RespondToAuthChallenge'
  ) {
    const params = {
      ChallengeName: req.body.ChallengeName,
      ClientId: req.body.ClientId,
      ChallengeResponses: req.body.ChallengeResponses,
    };
    cognitoIdp.respondToAuthChallenge(params, function (err, data) {
      if (err) {
        res.status(err.statusCode);
        res.json({
          message: err.message,
          __type: err.code,
        });
      } else {
        res.json(data);
      }
    });
  } else if (target === 'AWSCognitoIdentityProviderService.GetUser') {
    const params = {
      AccessToken: req.body.AccessToken,
    };
    cognitoIdp.getUser(params, function (err, data) {
      if (err) {
        res.status(err.statusCode);
        res.json({
          message: err.message,
          __type: err.code,
        });
      } else {
        res.json(data);
      }
    });
  } else if (target === 'AWSCognitoIdentityProviderService.RevokeToken') {
    AWS.config.credentials.refresh(() => {
      const params = {
        ClientId: req.body.ClientId,
        Token: req.body.Token,
      };
      cognitoIdp.revokeToken(params, function (err, data) {
        res.send();
      });
    });
  }
});

// 以下のURLに対する処理の定義
// https://cognito-identity.ap-northeast-1.amazonaws.com
app.post('/auth-ide', (req, res) => {
  const target = req.get('X-Amz-Target');
  const cognitoIde = new AWS.CognitoIdentity();

  if (target === 'AWSCognitoIdentityService.GetId') {
    const params = {
      IdentityPoolId: req.body.IdentityPoolId,
      Logins: req.body.Logins,
    };
    cognitoIde.getId(params, function (err, data) {
      if (err) console.log(err, err.stack);
      res.json(data);
    });
  } else if (target === 'AWSCognitoIdentityService.GetCredentialsForIdentity') {
    const params = {
      IdentityId: req.body.IdentityId,
      Logins: req.body.Logins,
    };
    cognitoIde.getCredentialsForIdentity(params, function (err, data) {
      if (err) console.log(err, err.stack);
      res.json(data);
    });
  }
});
