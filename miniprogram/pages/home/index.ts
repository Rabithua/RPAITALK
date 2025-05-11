// pages/home/index.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modes_value: getApp().globalData.modes_value,
    modes: [] as any,
    token: wx.getStorageSync("token"),
  },

  /**
   * 生命周期函数--监听页面加载
   */

  goSettings() {
    wx.vibrateShort({
      type: "medium",
    });
    wx.navigateTo({
      url: "../settings/index",
    });
  },

  goOthers() {
    wx.vibrateShort({
      type: "medium",
    });
    wx.navigateTo({
      url: "../others/index",
    });
  },

  goChat(e: any) {
    let that = this;
    let mode = that.data.modes[e.currentTarget.dataset.index];
    if (mode.lock) {
      wx.vibrateLong();
      wx.showToast({
        icon: "error",
        title: "暂未开放",
      });
    } else if (mode.context && !that.data.token) {
      wx.vibrateLong();
      wx.showToast({
        icon: "none",
        title: "使用包含上下文的模块需要自定义token",
      });
    } else {
      wx.vibrateShort({
        type: "medium",
      });
      wx.navigateTo({
        url: "../index/index?id=" + mode.id,
      });
    }
  },
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      token: wx.getStorageSync("token"),
      modes: this.data.modes_value,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    setTimeout(() => {
      this.setData({
        modes: [],
      });
    }, 500);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  },
});
