// pages/settings/index.ts
// @ts-ignore
const app = getApp<IAppOption>()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTokenDialog: false,
    token: '',
    inputToken: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      token: wx.getStorageSync('token')
    })
  },


  setShowTokenDialog() {
    wx.vibrateShort()
    this.setData({
      showTokenDialog: !this.data.showTokenDialog
    })
  },

  setToken() {
    wx.vibrateShort()
    this.setData({
      token: this.data.inputToken,
      showTokenDialog: false
    })
    wx.setStorageSync('token', this.data.inputToken)
    wx.showToast({
      icon: 'success',
      title: 'token已设置'
    })
  },

  resettoken() {
    wx.vibrateShort()
    wx.removeStorageSync('token')
    this.setData({
      token: ''
    })
    wx.showToast({
      icon: 'none',
      title: 'token已重置'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

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

  }
})