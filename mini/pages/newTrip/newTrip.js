// pages/newTrip/newTrip.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      user_id: ''
    },
    typeText: '司机',
    pubType:'driver',
    rTypeText:'找人',
    sex: ['请选择性别', '男', '女'],
    Surpluss: ['请选择', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isAgree: false,
    formData: {
      name: '朱秀娟',
      departure: '出发地',
      destination: '目的地',
      seats_count: 0,
      people_count: 0
    }
  },
  setSex: function (e) {
    this.setData({ 'data.formData.contact_gender': e.detail.value })
  },
  bindDateChange: function (e) {
    this.setData({
      'data.formData.leave_date': e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      'data.formData.leave_time': e.detail.value
    })
  },
  setseats_count: function (e) {
    this.setData({ 'data.formData.seats_count': e.detail.value })
  },
  setpeople_count: function (e) {
    this.setData({ 'data.formData.people_count': e.detail.value })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  // 提交表单
  formSubmit: function(e) {
    let data = e.detail.value;
    data.pc_type = this.data.pubType;
    // 获取本地存储的用户ID
    try {
      const value = wx.getStorageSync('user_id')
      if (value) {
        // that.setData({
        //   'userInfo.user_id': value
        // })
        data.user_id = value;
        wx.request({
          url: app.globalData.requestUrl + '/trip/create',
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data.info == 'success') {
              // 发布成功页面
              wx.redirectTo({
                url: '/pages/toolpages/newTripSuccessed'
              })
            }
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let typeText = ''
    let rTypeText = ''
    if(options.type == 'driver') {
      typeText = '司机'
      rTypeText = '找人'
    } else if (options.type == 'passenger') {
      typeText = '乘客'
      rTypeText = '找车'

    }
    this.setData({
      typeText: typeText,
      pubType: options.type,
      rTypeText: rTypeText
    })
  },

  // 获取出发位置
  handleDepartureLocation(e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'data.formData.departure': res.address
        })
      }
    })
  },
  // 获取目的位置
  handleDestinationLocation(e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'data.formData.destination': res.address
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