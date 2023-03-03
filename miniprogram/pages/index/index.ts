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

  submit() {
    switch (this.data.issue) {
      case '/clear':
        this.setData({
          issue: '',
          talks: []
        })
        wx.vibrateShort({
          type: 'light'
        })
        wx.clearStorageSync()

        break;
      case '/help':
        wx.vibrateShort()
        this.setData({
          chatSroll: 'help',
          issue: ''
        })
        break
      case '':
        wx.vibrateLong()
        wx.showToast({
          icon: 'error',
          title: '内容为空'
        })
        break
      default:
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
        console.log(this.data.talks.slice(-3))
        getAnswer(this.data.talks.slice(-3), app.globalData.url)
          .then((res: any) => {
            console.log(res)
            let talks_temp = this.data.talks
            talks_temp.push(res)
            wx.setNavigationBarTitle({
              title: 'RPAITALK'
            })
            wx.hideNavigationBarLoading()
            this.setData({
              talks: talks_temp,
              chatSroll: 'chat' + (talks_temp.length - 1),
              btnDisable: false
            })
            this.removeDoubleNewLine()
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
        break;
    }
  },

  removeDoubleNewLine() {
    let talks_temp = this.data.talks
    talks_temp.map((talk: any, index: any) => {
      talks_temp[index].content = talk.content.replace(/^\n\n/, '')
    })
    this.setData({
      talks: talks_temp
    })
  }

})
