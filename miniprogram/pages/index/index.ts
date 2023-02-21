// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const { getAnswer } = require('../../utils/request')

Page({
  data: {
    talks: [] as any,
    issue: '',
    btnDisable: false,
    chatSroll:''
  },

  onLoad() {
    // @ts-ignore
    try {
      var talks = wx.getStorageSync('talks')
      if (talks) {
        // Do something with return value
        this.setData({
          talks,
          chatSroll: 'chat' + (talks.length - 1)
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  input(e: any) {
    // console.log(e.detail.value)
    this.setData({
      issue: e.detail.value
    })
  },

  submit() {
    if (this.data.issue && this.data.issue !== '/clear') {
      let talks_temp = this.data.talks
      let issue = this.data.issue
      talks_temp.push({
        who: 'user',
        content: this.data.issue
      })
      this.setData({
        btnDisable: true,
        issue: '',
        talks: talks_temp,
        chatSroll: 'chat' + (talks_temp.length - 1),
      })
      wx.setStorage({
        key: 'talks',
        data: talks_temp
      })
      wx.vibrateShort({
        type: 'light'
      })
      wx.setNavigationBarTitle({
        title: '思考中...'
      })
      getAnswer(issue, app.globalData.url)
        .then((res: any) => {
          console.log(res.result)
          let talks_temp = this.data.talks
          talks_temp.push({
            who: 'openai',
            content: res.result.trim('\n\n')
          })
          wx.setNavigationBarTitle({
            title: 'RPAITALK'
          })
          this.setData({
            talks: talks_temp,
            chatSroll: 'chat' + (talks_temp.length - 1),
            btnDisable: false
          })
          wx.vibrateShort({
            type: 'light'
          })
          wx.setStorage({
            key: 'talks',
            data: talks_temp
          })
        })
        .catch((err: any) => {
          console.log(err)
          this.setData({
            btnDisable: false
          })
          wx.setNavigationBarTitle({
            title: 'RPAITALK'
          })
        })
    } else if (this.data.issue == '/clear') {
      this.setData({
        issue: '',
        talks: []
      })
      wx.vibrateShort({
        type: 'light'
      })
      wx.clearStorageSync()
    } else {
      wx.vibrateLong()
      wx.showToast({
        icon: 'error',
        title: '内容为空'
      })
    }
  }

})
