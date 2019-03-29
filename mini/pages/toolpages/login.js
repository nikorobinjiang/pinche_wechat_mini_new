// pages/toolpages/login.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onGotUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      // 本地存储
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      });
      // 全局变量
      app.globalData.userInfo = e.detail.userInfo;
    }
    // 调用登录方法
    const myLogingres = app.myLogin(e.detail);
    console.log(myLogingres)
    if(myLogingres == 'success'){
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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