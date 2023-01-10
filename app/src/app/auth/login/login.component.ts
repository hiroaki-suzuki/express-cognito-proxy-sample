import { Component, OnInit } from '@angular/core';
import { Amplify, API, Signer } from 'aws-amplify';
import { FetchHttpHandler } from '@aws-sdk/fetch-http-handler';
import { HttpRequest, HttpResponse } from '@aws-sdk/protocol-http';
import { HttpHandlerOptions } from '@aws-sdk/types';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  message: string = '';

  constructor() {}

  ngOnInit(): void {
    Amplify.configure(environment.amplify);

    // ユーザープールのエンドポイント
    // AmplifyのAuth.endpointでも書き換え可能
    // 以下のような形で無理やり書き換えられるが、
    // バージョンによっては以下がない可能性があるので、その場合は別のポイントを見つける必要がある
    Amplify.Auth.userPool.client.endpoint =
      environment.cognito.userPoolEndpoint;

    // IDプールのエンドポイント
    // Amplifyの方では提供されていないようで、書き換えがConfigではできなかった
    // 以下のような形で無理やり書き換えられるが、
    // バージョンによっては以下がない可能性があるので、その場合は別のポイントを見つける必要がある
    const orgHandleFunc = FetchHttpHandler.prototype.handle;
    FetchHttpHandler.prototype.handle = (
      request: HttpRequest,
      options: HttpHandlerOptions = {}
    ): Promise<{ response: HttpResponse }> => {
      if (
        request.hostname === 'cognito-identity.ap-northeast-1.amazonaws.com'
      ) {
        request.hostname = environment.cognito.idPoolHostname;
        request.protocol = environment.cognito.idPoolProtocol;
      }

      return orgHandleFunc.call(this, request, options);
    };

    // API GatewayのIAM認証を使用する場合に、署名のホストが合わずエラーになるため一時的に書き換える
    // 以下のような形で無理やり書き換えられるが、
    // バージョンによっては以下がない可能性があるので、その場合は別のポイントを見つける必要がある
    const orgSignFunc = Signer.sign;
    Signer.sign = (request: any, access_info: any, service_info?: any) => {
      const url = request.url;

      request.url = url.replace(
        environment.api.proxyHostPath,
        environment.api.apiGatewayHostPath
      );

      const signedRequest = orgSignFunc(request, access_info, service_info);
      signedRequest.url = url;

      return signedRequest;
    };
  }

  onAuth() {
    API.get('api', '/auth', {})
      .then((req) => {
        console.log(req);
        this.message = req.message;
      })
      .catch((err) => {
        console.log(err);
        this.message = err.message;
      });
  }

  onPublic() {
    API.get('api', '/public', {})
      .then((req) => {
        console.log(req);
        this.message = req.message;
      })
      .catch((err) => {
        console.log(err);
        this.message = err.message;
      });
  }
}
