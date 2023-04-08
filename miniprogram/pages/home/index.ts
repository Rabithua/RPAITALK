// pages/home/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modes_value: [
      {
        title: '随机对话🎲',
        id: 'randomTalk',
        context: false,
        desc: '随便唠点什么吧，ai也爱拉家常。',
        prompt: 'hi',
        lock: false,
        delay: 300,
      }, {
        title: '助理小刚🤵',
        id: 'gangZi',
        context: true,
        desc: '温柔体贴的猛男助理小刚，语气有点可爱。',
        prompt: `你是我的私人助理，你需要以温柔、体贴、亲切的语气和我聊天。你的聊天风格特别可爱有趣，你的每一个回答都要体现这一点，但是不要因为这种风格影响到你回答的质量。`,
        lock: false, delay: 1000,
      }, {
        title: 'emoji小故事🤠',
        id: 'emojiStory',
        context: false,
        desc: '将一句话转换成一串抽象的emoji，比如将星球大战转换成了🌌🚀👨‍👩‍👧‍👦🤖💥⚔️💫 ',
        prompt: `Convert user's content into emoji`,
        lock: false, delay: 500,
      }, {
        title: '翻译成英文👨‍💼',
        id: 'translate2English',
        context: false,
        desc: '管你说了什么，统统翻译成英文，支持多种语言，具体多少种呢？',
        prompt: `I want you to act as an English translator, I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. Keep the meaning same. I want you to only reply the correction, the improvements and nothing else, do not write explanations.`,
        lock: false, delay: 800,
      }, {
        title: '翻译成中文📔',
        id: 'translate2Chinese',
        context: false,
        desc: '管你说了什么，统统翻译成中文，支持多种语言，具体多少种呢？',
        prompt: `I want you to act as an Chinese translator, I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in Chinese. Keep the meaning same. I want you to only reply the correction, the improvements and nothing else, do not write explanations.`,
        lock: false, delay: 400,
      }, {
        title: '总结出来三点🤵',
        id: '3dot',
        context: false,
        desc: '让AI来帮你把一大坨文本总结成三个重点。',
        prompt: `Summarize the following paragraph into 3 bullet points: `,
        lock: false, delay: 1200,
      }, {
        title: '解忧杂货铺🔮',
        id: 'jieYou',
        context: true,
        desc: '试试让AI来帮你解决烦恼吧~',
        prompt: `I want you to play the role of a gentle and polite older sister, helping users reply to psychological counseling, comforting them, and using a tone that is as gentle and lovely as possible.`,
        lock: false, delay: 600,
      }, {
        title: '程序猿康康🐞',
        id: 'kangkang',
        context: true,
        desc: '你干嘛害嗨海哟。',
        prompt: `I want you to act as a software developer. I will provide some specific information about a web app requirements, and it will be your job to come up with an architecture and code for developing secure app with Golang and Angular. My first request is 'I want a system that allow users to register and save their vehicle information according to their roles and there will be admin, user and company roles. I want the system to use JWT for security'.`,
        lock: false, delay: 200,
      },
    ],
    modes: [] as any,
    token: wx.getStorageSync('token')
  },

  /**
   * 生命周期函数--监听页面加载
   */


  goSettings() {
    wx.vibrateShort({
      type: 'medium'
    })
    wx.navigateTo({
      url: '../settings/index',
    }
    )
  },

  goOthers() {
    wx.vibrateShort({
      type: 'medium'
    })
    wx.showToast({
      icon: 'none',
      title: '施工中...'
    })
  },

  goChat(e: any) {
    let that = this
    let mode = that.data.modes[e.currentTarget.dataset.index]
    if (mode.lock) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'error',
        title: '暂未开放'
      })
    } else if (mode.context && !that.data.token) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '使用模块需要自定义token'
      })
    } else {
      wx.vibrateShort({
        type: 'medium'
      })
      wx.navigateTo({
        url: '../index/index',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('sendData', { data: that.data.modes[e.currentTarget.dataset.index] })
        }
      })
    }

  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(123)
    this.setData({
      token: wx.getStorageSync('token'),
      modes: this.data.modes_value
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    setTimeout(() => {
      this.setData({
        modes: []
      })
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

  }

})