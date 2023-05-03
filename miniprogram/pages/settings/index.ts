// pages/settings/index.ts
// @ts-ignore
const app = getApp<IAppOption>();
import {
  modelArray,
  presenceArray,
  temperatureArray,
} from "../../utils/options";

Page({
  data: {
    showTokenDialog: false,
    token: "",
    inputToken: "",
    modelArray: modelArray,
    temperatureArray: temperatureArray,
    presenceArray: presenceArray,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // @ts-ignore
    const env = __wxConfig.envVersion; 
    console.log(env)
    this.setData({
      token: wx.getStorageSync("token"),
      env
    });
  },

  modelChange(e: any) {
    wx.vibrateShort();
    this.setData({
      modelIndex: e.detail.value,
    });
    wx.setStorageSync("modelIndex", e.detail.value);
  },

  temperatureChange(e: any) {
    wx.vibrateShort();
    this.setData({
      temperatureIndex: e.detail.value,
    });
    wx.setStorageSync("temperatureIndex", e.detail.value);
  },

  maxTokensChange(e: any) {
    wx.vibrateShort();
    let value = e.detail.value.trim();
    if (value < 4000 && value > 10) {
      this.setData({
        maxTokens: value,
      });
      wx.setStorageSync("maxTokens", value);
    } else {
      wx.showToast({
        icon: "none",
        title: "请输入10-4000之间的数字",
      });
    }
  },

  presenceChange(e: any) {
    wx.vibrateShort();
    this.setData({
      presenceIndex: e.detail.value,
    });
    wx.setStorageSync("presenceIndex", e.detail.value);
  },

  focusToken() {
    wx.vibrateShort();
    this.setData({
      tokenFocus: true,
    });
  },

  setShowTokenDialog() {
    wx.vibrateShort();
    this.setData({
      showTokenDialog: !this.data.showTokenDialog,
    });
  },

  setToken() {
    wx.vibrateShort();
    wx.setStorageSync("token", this.data.token);
    wx.showToast({
      icon: "success",
      title: "token已设置",
    });
  },

  resettoken() {
    wx.vibrateShort();
    wx.removeStorageSync("token");
    this.setData({
      token: "",
    });
    wx.showToast({
      icon: "none",
      title: "token已重置",
    });
  },

  onReady() {},

  onShow() {
    this.setData({
      modelIndex: wx.getStorageSync("modelIndex")
        ? wx.getStorageSync("modelIndex")
        : 0,
      temperatureIndex: wx.getStorageSync("temperatureIndex")
        ? wx.getStorageSync("temperatureIndex")
        : 10,
      maxTokens: wx.getStorageSync("maxTokens")
        ? wx.getStorageSync("maxTokens")
        : "2000",
      presenceIndex: wx.getStorageSync("presenceIndex")
        ? wx.getStorageSync("presenceIndex")
        : 20,
    });
  },
});
