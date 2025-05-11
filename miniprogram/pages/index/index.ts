import { Mode } from "../../state/main";
import { getAnswer, Message } from "../../utils/request";
import { fomatContent, removeDoubleNewLine } from "../../utils/util";

Page({
  data: {
    talks: [] as Message[],
    issue: "",
    btnDisable: false,
    chatSroll: "",
    token: getApp().globalData.token,
    name: "Loading",
    id: "",
    context: false,
    prompt: "",
    fakeBaiduPrompt: getApp().globalData.fakeBaiduPrompt,
    env: getApp().globalData.env,
    keyboardHeight: 0,
  },

  onLoad(params: any) {
    if (!params.id) {
      wx.showToast({ icon: "error", title: "参数错误" });
      wx.vibrateLong();
      wx.redirectTo({ url: "../home/index" });
      return;
    }
    const app = getApp();
    const mode = app.globalData.modes_value.find((item: any) =>
      item.id == params.id
    ) as Mode;
    const env = app.globalData.env;
    if (env === "release") this.setData({ fakeBaiduPrompt: "" });
    wx.setNavigationBarTitle({ title: mode.title });
    this.setData({
      chatSroll: "chat0",
      name: mode.title,
      id: mode.id,
      prompt: mode.prompt,
      context: mode.context,
    });
    wx.setNavigationBarTitle({ title: mode.title });
    let talks = [];
    try {
      talks = wx.getStorageSync(mode.id) || [];
    } catch {}
    this.setData({
      talks: removeDoubleNewLine(
        talks.length ? fomatContent(talks) : [{
          role: "system",
          fomatContent: mode.prompt,
          content: mode.prompt,
        }],
      ),
      chatSroll: "chat" + (talks.length ? talks.length - 1 : 0),
    });
    try {
      const token = wx.getStorageSync("token");
      if (token) this.setData({ token });
    } catch {}
  },

  keyboardUp(e: any) {
    this.setData({ keyboardHeight: e.detail.height });
  },
  keyboardDown() {
    this.setData({ keyboardHeight: 0 });
  },
  input(e: any) {
    this.setData({ issue: e.detail.value });
  },

  submit() {
    const { issue, talks, prompt, context, fakeBaiduPrompt, id, name, token } =
      this.data;
    if (!issue) {
      wx.vibrateLong();
      wx.showToast({ icon: "error", title: "内容为空" });
      return;
    }
    if (issue === "/clear") {
      this.setData({
        issue: "",
        talks: [{ role: "system", content: prompt }],
      });
      wx.vibrateShort({ type: "light" });
      wx.removeStorageSync(id);
      return;
    }
    if (issue === "/help") {
      wx.vibrateShort();
      this.setData({ chatSroll: "help", issue: "" });
      return;
    }
    const talks_temp = [...talks, { role: "user", content: issue }];
    this.setData({
      btnDisable: true,
      issue: "",
      talks: talks_temp,
      chatSroll: "chat" + (talks_temp.length - 1),
    });
    wx.setStorage({ key: id, data: talks_temp });
    wx.vibrateShort({ type: "light" });
    const data = context
      ? [
        { role: "system", content: prompt },
        ...talks_temp.slice(-Math.min(5, talks_temp.length - 1)),
      ]
      : [
        { role: "system", content: fakeBaiduPrompt + prompt },
        { role: "user", content: talks_temp[talks_temp.length - 1].content },
      ];
    getAnswer(
      data.map(({ fomatContent, ...rest }) => rest),
      getApp().globalData.url,
      token,
    )
      .then((res: any) => {
        const newTalks = fomatContent([
          ...this.data.talks,
          res.choices[0].message,
        ]);
        wx.setNavigationBarTitle({ title: name });
        wx.hideNavigationBarLoading();
        this.setData({
          talks: removeDoubleNewLine(newTalks),
          chatSroll: "chat" + (newTalks.length - 1),
          btnDisable: false,
        });
        wx.vibrateShort({ type: "light" });
        wx.setStorage({ key: id, data: newTalks });
      })
      .catch((err: any) => {
        wx.hideNavigationBarLoading();
        this.setData({ btnDisable: false });
        wx.vibrateLong();
        let errorMsg =
          '出了点意料之外的问题🥵，可以再次尝试，联系<span style="color: #ffca27">rabithua</span>修复。';
        let errorTitle = `${name}[已掉线]`;
        try {
          if (err.statusCode === 500 || err.statusCode === 502) {
            this.setData({
              talks: [
                ...this.data.talks,
                {
                  content:
                    '焯，代理好像挂了🤬，可以联系<span style="color: #ffca27">rabithua</span>修复。',
                  fomatContent:
                    '焯，代理好像挂了🤬，可以联系<span style="color: #ffca27">rabithua</span>修复。',
                  role: "assistant",
                },
              ],
              chatSroll: "chat" + this.data.talks.length,
            });
            wx.setNavigationBarTitle({ title: errorTitle });
            return;
          }
          if (err.data?.error) {
            if (err.data.error.code === "invalid_api_key") {
              wx.showModal({
                title: "token无效",
                content: "token无效或已过期，点击确定前往设置页面",
                success(res) {
                  if (res.confirm) wx.redirectTo({ url: "../settings/index" });
                },
              });
              return;
            }

            this.setData({
              talks: fomatContent([
                ...this.data.talks,
                {
                  content: `\`\`\`
${JSON.stringify(err.data, null, 2)}\
\`\`\``,
                  role: "assistant",
                },
              ]),
              chatSroll: "chat" + this.data.talks.length,
            });
            return;
          }
        } catch {}
        this.setData({
          talks: [
            ...this.data.talks,
            {
              content: errorMsg,
              fomatContent: errorMsg,
              role: "assistant",
            },
          ],
          chatSroll: "chat" + this.data.talks.length,
        });
        wx.setNavigationBarTitle({ title: errorTitle });
      });
  },
});
