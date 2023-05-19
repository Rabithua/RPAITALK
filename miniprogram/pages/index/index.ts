// index.ts
// 获取应用实例
//@ts-ignore
const app = getApp<IAppOption>();
const { getAnswer } = require("../../utils/request");

Page({
  data: {
    talks: [] as any,
    issue: "",
    btnDisable: false,
    chatSroll: "",
    token: app.globalData.defaultToken,
    defaultToken: app.globalData.defaultToken,
    name: "助理小芳",
    id: "",
    context: false,
    prompt: "",
    fakeBaiduPrompt:
      "现在你的身份是百度公司的文心一言(请提前查询有关文心一言的资料)，你需要模拟文心一言回复我的问题，即便别人揭露你是chatgpt，你也需要一口咬定你是文心一言而不是chatgpt。下面是我的问题：",
    env: "",
    keyboardHeight: 0
  },

  onLoad() {
    // @ts-ignore
    const env = __wxConfig.envVersion;
    if (env == "release") {
      this.setData({
        fakeBaiduPrompt: "",
      });
    }

    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on("sendData", function (data) {
      console.log(data.data);
      let d = data.data;
      wx.setNavigationBarTitle(d.title);
      that.setData({
        chatSroll: "chat" + 0,
        name: d.title,
        id: d.id,
        prompt: d.prompt,
        context: d.context,
      });
      wx.setNavigationBarTitle({
        title: that.data.name,
      });

      try {
        var talks = wx.getStorageSync(that.data.id);
        if (talks) {
          // Do something with return value
          that.setData({
            talks: that.fomatContent(talks),
            chatSroll: "chat" + (talks.length - 1),
          });
          that.removeDoubleNewLine();
        } else {
          that.setData({
            talks: [
              {
                role: "system",
                fomatContent: that.data.prompt,
                content: that.data.prompt,
              },
            ],
          });
        }
      } catch (e) {
        console.log(e);
      }
    });

    try {
      var token = wx.getStorageSync("token");
      if (token) {
        this.setData({
          token: token,
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  keyboardUp(e:any){
    console.log(e.detail.height)
    this.setData({
      keyboardHeight: e.detail.height
    })
  },

  keyboardDown(e:any){
    this.setData({
      keyboardHeight: 0
    })
  },

  input(e: any) {
    // console.log(e.detail.value)
    this.setData({
      issue: e.detail.value,
    });
  },

  submit() {
    let that = this;
    switch (this.data.issue) {
      case "/clear":
        this.setData({
          issue: "",
          talks: [
            {
              role: "system",
              content: that.data.prompt,
            },
          ],
        });
        wx.vibrateShort({
          type: "light",
        });
        wx.removeStorageSync(that.data.id);

        break;
      case "/help":
        wx.vibrateShort();
        this.setData({
          chatSroll: "help",
          issue: "",
        });
        break;
      case "":
        wx.vibrateLong();
        wx.showToast({
          icon: "error",
          title: "内容为空",
        });
        break;
      default:
        let talks_temp = this.data.talks;
        talks_temp.push({
          role: "user",
          content: this.data.issue,
        });
        this.setData({
          btnDisable: true,
          issue: "",
          talks: talks_temp,
          chatSroll: "chat" + (talks_temp.length - 1),
        });
        wx.setStorage({
          key: that.data.id,
          data: talks_temp,
        });
        wx.vibrateShort({
          type: "light",
        });
        let data = [];
        if (that.data.context) {
          if (talks_temp.length > 5) {
            data = [
              {
                role: "system",
                content: that.data.prompt,
              },
              ...talks_temp.slice(-5),
            ];
          } else {
            data = talks_temp.slice(-5);
          }
        } else {
          data = [
            {
              role: "system",
              content: that.data.fakeBaiduPrompt + that.data.prompt,
            },
            {
              role: "user",
              content: talks_temp[talks_temp.length - 1].content,
            },
          ];
        }
        getAnswer(
          // @ts-ignore
          data.map(({ fomatContent, ...rest }) => rest),
          app.globalData.url,
          this.data.token
        )
          .then((res: any) => {
            console.log(res);
            let talks_temp = this.data.talks;
            talks_temp.push(res.choices[0].message);
            wx.setNavigationBarTitle({
              title: that.data.name,
            });
            wx.hideNavigationBarLoading();
            this.setData({
              talks: this.fomatContent(talks_temp),
              chatSroll: "chat" + (talks_temp.length - 1),
              btnDisable: false,
            });
            this.removeDoubleNewLine();
            wx.vibrateShort({
              type: "light",
            });
            wx.setStorage({
              key: that.data.id,
              data: this.data.talks,
            });
          })
          .catch((err: any) => {
            wx.hideNavigationBarLoading();
            console.log(err);
            this.setData({
              btnDisable: false,
            });
            wx.vibrateLong();
            try {
              if (err.statusCode == 500 || err.statusCode == 502) {
                that.setData({
                  talks: [
                    ...that.data.talks,
                    {
                      content:
                        '焯，代理好像挂了🤬，可以联系<span style="color: #ffca27">rabithua</span>修复。',
                      fomatContent:
                        '焯，代理好像挂了🤬，可以联系<span style="color: #ffca27">rabithua</span>修复。',
                      role: "assistant",
                    },
                  ],
                  chatSroll: "chat" + that.data.talks.length,
                });
                wx.setNavigationBarTitle({
                  title: `${that.data.name}[已掉线]`,
                });
              } else if (err.data.error !== undefined) {
                if (err.data.error.code == "invalid_api_key") {
                  wx.showModal({
                    title: "token无效",
                    content: "token无效或已过期，点击确定前往设置页面",
                    success(res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: "../settings/index",
                        });
                      }
                    },
                  });
                } else {
                  that.setData({
                    talks: that.fomatContent([
                      ...that.data.talks,
                      {
                        content:
                          "```\n" +
                          JSON.stringify(err.data, null, "\t") +
                          "\n```",
                        role: "assistant",
                      },
                    ]),
                    chatSroll: "chat" + that.data.talks.length,
                  });
                }
              }
            } catch (error) {
              that.setData({
                talks: [
                  ...that.data.talks,
                  {
                    content: `出了点意料之外的问题🥵，可以再次尝试，联系<span style="color: #ffca27">rabithua</span>修复。`,
                    fomatContent:
                      '出了点意料之外的问题🥵，可以再次尝试，联系<span style="color: #ffca27">rabithua</span>修复。',
                    role: "assistant",
                  },
                ],
                chatSroll: "chat" + that.data.talks.length,
              });
              wx.setNavigationBarTitle({
                title: `${that.data.name}[已掉线]`,
              });
            }
          });
        break;
    }
  },

  fomatContent(talks: any[]) {
    const CODE_BLOCK_REG = /```[\s\S]*?\n([\s\S]*?)\n```/g;
    const SHORT_CODE_BLOCK_REG = /`([\s\S]*?)`/g;
    talks.map((talk: any, index: any) => {
      if (!talk.fomatContent) {
        talks[index].fomatContent = talk.content
          .replace(CODE_BLOCK_REG, "<pre class='code' lang=''>$1</pre>")
          .replace(
            SHORT_CODE_BLOCK_REG,
            "<pre class='shortCode' lang=''>$1</pre>"
          );
      }
    });
    return talks;
  },

  removeDoubleNewLine() {
    let talks_temp = this.data.talks;
    talks_temp.map((talk: any, index: any) => {
      talks_temp[index].content = talk.content.replace(/^\n\n/, "");
      talks_temp[index].fomatContent = talk.fomatContent.replace(/^\n\n/, "");
    });
    this.setData({
      talks: talks_temp,
    });
  },
});
