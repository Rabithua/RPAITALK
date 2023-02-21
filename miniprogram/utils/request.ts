export const getAnswer = (content: string, url: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/openai',
      method: "POST",
      data: JSON.stringify({
        "content": content
      }),
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail(err) {
        console.log(err)
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '没想出来',
        })
        reject(err)
      }
    })
  })
}