//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: e => {
              // 本地存储
              wx.setStorage({
                key: 'userInfo',
                data: e.userInfo
              });
              // 全局变量
              that.globalData.userInfo = e.userInfo;
              // 微信登录
              wx.login({
                success: res1 => {
                  // 发送 res1.code 到后台换取 openId, sessionKey, unionId
                  if (res1.code) {
                    // 发起网络请求 后台登录
                    wx.request({
                      url: this.globalData.requestUrl + '/mini_login',
                      data: {
                        code: res1.code,
                        encryptedData: e.encryptedData,
                        signature: e.signature,
                        iv: e.iv
                      },
                      success(result) {
                        // 全局存储
                        that.globalData.user_id = result.data.user_id;
                        // 本地存储
                        wx.setStorageSync('user_id', result.data.user_id);
                      }
                    })
                  } else {
                    console.log('登录失败！' + res1.errMsg)
                  }
                }
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    })
  },
  // 微信登录 调用后台接口登录
  myLogin: function(e) {
    let that = this;
    // 微信登录
    wx.login({
      success: res1 => {
        // 发送 res1.code 到后台换取 openId, sessionKey, unionId
        if (res1.code) {
          // 发起网络请求 后台登录
          wx.request({
            url: this.globalData.requestUrl + '/mini_login',
            data: {
              code: res1.code,
              encryptedData: e.encryptedData,
              signature: e.signature,
              iv: e.iv
            },
            success(result) {
              // 全局存储
              that.globalData.user_id = result.data.user_id;
              // 本地存储
              wx.setStorageSync('user_id', result.data.user_id);
            }
          })
        } else {
          console.log('登录失败！' + res1.errMsg);
          return false;
        }
      }
    });
    return 'success';
  },
  userInfoReadyCallback: function(res) {
    console.log('页面加载成功')
  },
  globalData: {
    requestUrl: 'http://129.211.134.29:8080'
  }
})