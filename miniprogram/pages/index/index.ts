// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const { getAnswer } = require('../../utils/request')

Page({
  data: {
    talks: [] as any,
    issue: '',
    btnDisable: false,
    chatSroll: ''
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

  copy(e: any) {
    console.log(e.currentTarget.dataset.content)
    wx.setClipboardData({
      data: e.currentTarget.dataset.content
    })
  },

  input(e: any) {
    // console.log(e.detail.value)
    this.setData({
      issue: e.detail.value
    })
  },

  // 旧版openai模型上下文方法
  issueWithContext() {
    let talks = this.data.talks.slice(-3)
    let newTalks = []
    for (let i = 0; i < talks.length; i++) {
      if (talks[i].who == 'user') {
        newTalks.push('human:' + talks[i].content + (talks[i].issueFix ? talks[i].issueFix : ''))
      } else {
        newTalks.push('ai:' + talks[i].content)
      }
    }
    return newTalks.join('/n ') + '/n ai:'
  },

  submit() {
    if (this.data.issue == '/clear') {
      this.setData({
        issue: '',
        talks: []
      })
      wx.vibrateShort({
        type: 'light'
      })
      wx.clearStorageSync()
    } else if (this.data.issue == '/help') {
      wx.vibrateShort()
      this.setData({
        chatSroll: 'help',
        issue: ''
      })
    } else if (this.data.issue == '') {
      wx.vibrateLong()
      wx.showToast({
        icon: 'error',
        title: '内容为空'
      })
    } else {
      let talks_temp = this.data.talks
      talks_temp.push({
        role: 'user',
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
      console.log(this.issueWithContext())
      getAnswer(this.issueWithContext(), app.globalData.url)
        .then((res: any) => {
          console.log(res.result)
          let talks_temp = this.data.talks
          console.log(res.result.match(/\n\n([\s\S]*)/), typeof (res.result.match(/\n\n([\s\S]*)/)));
          console.log(res.result.match(/([\s\S]*)\n\n[\s\S]/), typeof (res.result.match(/([\s\S]*)\n\n[\s\S]/)))
          if (res.result.match(/(.*?)\n\n/)) {
            talks_temp[talks_temp.length - 1].issueFix = res.result.match(/(.*?)\n\n/)[1]
          }
          talks_temp.push({
            role: 'assistant',
            content: res.result.match(/\n\n([\s\S]*)/) ? res.result.match(/\n\n([\s\S]*)/)[1] : res.result
          })
          wx.setNavigationBarTitle({
            title: 'RPAITALK'
          })
          wx.hideNavigationBarLoading()
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
          wx.hideNavigationBarLoading()
          console.log(err)
          this.setData({
            btnDisable: false
          })
          if (err.statusCode == 500) {
            wx.setNavigationBarTitle({
              title: '服务器繁忙🥵'
            })
          } else {
            wx.setNavigationBarTitle({
              title: 'Something wrong🐞'
            })
          }
        })
    }
  },

  issueFixTip() {
    wx.vibrateShort({
      type: 'light'
    })
    wx.showToast({
      icon: 'none',
      title: '问题由openai自动补充'
    })
  }

})
