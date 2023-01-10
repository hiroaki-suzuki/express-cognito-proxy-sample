import { Component, OnInit } from '@angular/core';
import { Amplify, Signer } from 'aws-amplify';
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
  constructor() {}

  ngOnInit(): void {
    Amplify.configure(environment.amplify);

    // ユーザープールのエンドポイント
    // AmplifyのAuth.endpointでも書き換え可能
    // ただし、古いバージョンだと設定が用意されていないため、以下のような形で無理やり書き換える
    // バージョンによっては以下がなかったりするので、その場合は別のポイントを見つける必要がある
    Amplify.Auth.userPool.client.endpoint =
      environment.cognito.userPoolEndpoint;

    // IDプールのエンドポイント
    // Amplifyの方では提供されていないようで、書き換えがConfigではできなかった
    // 以下のような形で無理やり書き換える
    // バージョンによっては以下がなかったりするので、その場合は別のポイントを見つける必要がある
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

    // TODO
    // API GatewayのIAM認証を使用する場合に、ホストが合わずエラーになるため一時的に書き換える
    // const orgSignFunc = Signer.sign;
    // Signer.sign = (request: any, access_info: any, service_info?: any) => {
    //   const url = request.url;
    //
    //   request.url = url.replace(
    //     'proxy.domain/rootpath',
    //     'xxxxxx.execute-api.ap-northeast-1.amazonaws.com/test'
    //   );
    //
    //   const signedRequest = orgSignFunc(request, access_info, service_info);
    //   signedRequest.url = url;
    //
    //   return signedRequest;
    // }
  }
}
