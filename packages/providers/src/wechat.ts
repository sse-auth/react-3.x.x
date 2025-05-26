import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';

/** @see [Get the authenticated user](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html) */
export interface WeChatProfile {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
  [claim: string]: unknown;
}

export default function WeChat(
  options: OAuthUserConfig<WeChatProfile> & {
    platformType?: 'OfficialAccount' | 'WebsiteApp';
  }
): OAuthConfig<WeChatProfile> {
  const { clientId, clientSecret, platformType = 'OfficialAccount' } = options;

  return {
    id: 'wechat',
    name: 'WeChat',
    type: 'oauth',
    // style: { logo: "/wechat.svg", bg: "#fff", text: "#000" },
    checks: ['state'],
    authorization: {
      url:
        platformType === 'OfficialAccount'
          ? 'https://open.weixin.qq.com/connect/oauth2/authorize'
          : 'https://open.weixin.qq.com/connect/qrconnect',
      params: {
        appid: clientId,
        scope: platformType === 'OfficialAccount' ? 'snsapi_userinfo' : 'snsapi_login',
      },
    },
    token: {
      url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      params: { appid: clientId, secret: clientSecret },
      async conform(response) {
        const data = await response.json();
        if (data.token_type === 'bearer') {
          console.warn("token_type is 'bearer'. Redundant workaround, please open an issue.");
          return response;
        }
        return Response.json({ ...data, token_type: 'bearer' }, response);
      },
    },
    userinfo: {
      url: 'https://api.weixin.qq.com/sns/userinfo',
      async request({ tokens, provider }) {
        if (!provider.userinfo) return;

        const url = new URL(provider.userinfo.url);
        url.searchParams.set('access_token', tokens.access_token!);
        url.searchParams.set('openid', String(tokens.openid));
        url.searchParams.set('lang', 'zh_CN');
        const response = await fetch(url);
        return response.json();
      },
    },
    profile(profile) {
      return {
        id: profile.unionid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      };
    },
    options,
  };
}

export { WeChat };
