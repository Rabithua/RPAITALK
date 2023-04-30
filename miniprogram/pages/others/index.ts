// pages/others/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apps:[
      {
        name: '溜了个狗',
        id: 'llgg',
        desc: '在附近寻找可爱的宠友～',
        appid: 'wx77f858b31146d3fa'
      },
      {
        name: '麦默',
        id: 'memos',
        desc: '把脑袋里的碎片收集起来🧩',
        appid: 'wx93424d86ffa7d6ac'
      }
    ]
  },

  go(e:any) {
    console.log(e.target.dataset.appid)
    wx.vibrateShort()
    wx.navigateToMiniProgram({
      appId: e.target.dataset.appid
    })
  },
  
  onShareAppMessage() {

  }
})