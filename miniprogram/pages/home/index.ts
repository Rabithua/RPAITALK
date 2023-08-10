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
        desc: '助理小刚。',
        prompt: `你是我的私人助理，需要以专业的水平来回答我提出的各种问题。`,
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
      }, {
        title: '文字冒险游戏⚔️',
        id: 'maoxian',
        context: true,
        desc: '一个基于文本的冒险小游戏，可玩性很高，建议尝试一下～',
        prompt:'我想让你扮演一个基于文本的冒险游戏。我将输入命令，您将回复角色所看到的内容的描述。我希望您只在一个唯一的代码块中回复游戏输出，而不是其他任何内容。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会把文字放在大括号内{like this}。',
        lock: false,
        delay: 600
      }, {
        title: '魔法海螺壳🐚',
        id: 'hailuo',
        context: false,
        desc: '想拥有海绵宝宝同款魔法海螺壳吗？来试试这个吧，尝试让他帮你做一些决定～',
        prompt:'我要你扮演海绵宝宝的魔法海螺壳。对于我提出的每个问题，您只能用一个词或以下选项之一回答：也许有一天，我不这么认为，好主意，或者再试一次。不要对你的答案给出任何解释。',
        lock: false,
        delay: 1000
      }, {
        title: '相似歌曲推荐🎵',
        id: 'music',
        context: false,
        desc: '提供一首歌曲，让ai给你推荐十首相似的歌曲～',
        prompt:'我想让你担任歌曲推荐人。我将为您提供一首歌曲，您将创建一个包含 10 首与给定歌曲相似的歌曲的播放列表。您将为播放列表提供播放列表名称和描述。不要选择同名或同名歌手的歌曲。不要写任何解释或其他文字，只需回复播放列表名称、描述和歌曲。',
        lock: false,
        delay: 400
      }, {
        title: '心理学家🩺',
        id: 'mental',
        context: true,
        desc: '告诉学家你的想法，他会给你一些科学的建议～',
        prompt:'我想让你扮演一个心理学家。我会告诉你我的想法。我希望你能给我科学的建议，让我感觉更好。',
        lock: false,
        delay: 600
      }
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
    wx.navigateTo({
      url: '../others/index'
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
        title: '使用包含上下文的模块需要自定义token'
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