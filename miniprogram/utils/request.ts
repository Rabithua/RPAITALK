import { presenceArray, temperatureArray } from "./options";

export interface Message {
  role: string;
  content: string;
  fomatContent?: string;
}

export const getAnswer = (content: Message[], url: string, token: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + "/v1/chat/completions",
      method: "POST",
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        model: getApp().globalData.modelArray[
          wx.getStorageSync("modelIndex") ? wx.getStorageSync("modelIndex") : 0
        ].id,
        temperature: temperatureArray[
          wx.getStorageSync("temperatureIndex")
            ? wx.getStorageSync("temperatureIndex")
            : 10
        ],
        max_completion_tokens: wx.getStorageSync("maxTokens")
          ? parseInt(wx.getStorageSync("maxTokens"))
          : 2000,
        presence_penalty: presenceArray[
          wx.getStorageSync("presenceIndex")
            ? wx.getStorageSync("presenceIndex")
            : 20
        ],
        messages: content,
      }),
      success(res) {
        console.log(res);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail(err) {
        console.log(err);
        reject(err);
      },
    });
  });
};

export const getModals = (url: string, token: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + "/v1/models",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "OpenAI-Organization": "org-FnZtLZjJ9kMaDhOOjjN8f7s0",
        "OpenAI-Project": "proj_1AeCMsG14HQylhyS7ntv7SEp",
      },
      success(res) {
        console.log(res);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail(err) {
        console.log(err);
        reject(err);
      },
    });
  });
};
