// export const getAnswer = (content: string, url: string) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: url + '/chatgpt',
//       method: "POST",
//       data: JSON.stringify({
//         "content": content
//       }),
//       success(res) {
//         console.log(res)
//         if (res.statusCode == 200) {
//           resolve(res.data)
//         } else {
//           reject(res)
//         }
//       },
//       fail(err) {
//         console.log(err)
//         wx.vibrateLong()
//         wx.showToast({
//           icon: 'none',
//           title: '没想出来',
//         })
//         reject(err)
//       }
//     })
//   })
// }

import { modelArray, presenceArray, temperatureArray } from "./options";

export const getAnswer = (content: string, url: string, token: string) => {
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
        model:
          modelArray[
            wx.getStorageSync("modelIndex")
              ? wx.getStorageSync("modelIndex")
              : 0
          ],
        temperature:
          temperatureArray[
            wx.getStorageSync("temperatureIndex")
              ? wx.getStorageSync("temperatureIndex")
              : 10
          ],
        max_tokens: wx.getStorageSync("maxTokens")
          ? parseInt(wx.getStorageSync("maxTokens"))
          : 2000,
        presence_penalty:
          presenceArray[
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
