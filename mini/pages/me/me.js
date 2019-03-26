// pages/me/me.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo:false,
    userInfo: {
      nickName: '',
      avatarUrl: ''
    }
  },
  // 用户点击登录
  onGotUserInfo: function(e) {
    // console.log(e);
    var that = this;
    if(e.detail.userInfo){
      // 显示用户头像昵称
      that.setData({
        'hasUserInfo': true,
        'userInfo.nickName': e.detail.userInfo.nickName,
        'userInfo.avatarUrl': e.detail.userInfo.avatarUrl
      })
      // 本地存储
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      });
      // 全局变量
      app.globalData.userInfo = e.detail.userInfo;
      // 微信登录
      wx.login({
        success: res1 => {
          // console.log(res1)
          // 发送 res1.code 到后台换取 openId, sessionKey, unionId
          if (res1.code) {
            // 发起网络请求 后台登录
            wx.request({
              url: app.globalData.requestUrl + '/mini_login',
              data: {
                code: res1.code,
                encryptedData: e.encryptedData,
                signature: e.signature,
                iv: e.iv
              },
              success(result) {
                // 全局存储
                app.globalData.user_id = result.data.user_id;
                // 本地存储
                wx.setStorageSync('user_id', result.data.user_id);
              }
            })
          } else {
            console.log('登录失败！' + res1.errMsg)
          }
        }
      })
    }
    
  },
  // 跳转
  toMyTrips: function() {
    wx.navigateTo({
      url: 'myTrip'
    })
  },
  // 分享
  handleShare: function() {
    wx.showShareMenu({
      withShareTicket: false,
      success() { },
      fail(e) {
        console.log(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(value) {
        that.setData({
          'hasUserInfo':true,
          'userInfo.nickName':value.data.nickName,
          'userInfo.avatarUrl': value.data.avatarUrl
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})