import { IAppOption } from "../typings";
import { globalData, Model } from "./state/main";
import { getModals } from "./utils/request";

// app.ts
App<IAppOption>({
  globalData: globalData,
  onLaunch() {
    getModals(
      this.globalData.url,
      this.globalData.token,
    ).then((res: any) => {
      if (res.object !== "list") {
        wx.showToast({
          icon: "error",
          title: "获取模型列表失败",
        });
        return;
      }
      let textModels: Model[] = res.data.filter(
        (item: Model) => item.id.search("gpt") > -1,
      );
      console.log(textModels);

      this.globalData.modelArray = textModels;
      wx.setStorageSync("modelArray", this.globalData.modelArray);
    }).catch((err: any) => {
      console.log(err);
      wx.showToast({
        icon: "error",
        title: "获取模型列表失败",
      });
    });
  },
});
