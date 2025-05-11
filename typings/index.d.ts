/// <reference path="./types/index.d.ts" />

import { GlobalData } from "../miniprogram/state/main";

interface IAppOption {
  globalData: GlobalData;
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}
