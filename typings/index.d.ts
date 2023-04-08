/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    url?: string,
    defaultToken?: string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}