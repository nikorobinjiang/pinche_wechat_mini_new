// pages/newTrip/newTrip.js
const app = getApp();
const date = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部错误提示
    showTopTips:false,
    errorMsg: '',
    userInfo: {
      user_id: ''
    },
    typeText: '',
    pubType:'',
    rTypeText:'',
    genderItems: [
      { name: '男', value: '1' },
      { name: '女', value: '2' }
    ],
    Surpluss: ['请选择', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isAgree: false,
    tripDetail:{
    },
    formData: {
    },
    start:date.getFullYear() + '-' + (date.getMonth()+1) + '-'+date.getDate(),
    end: (date.getFullYear()+3) + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  },
  showTopTips: function (msg) {
    var that = this;
    this.setData({
      errorMsg: msg,
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  genderChange: function (e) {
    var genderItems = this.data.genderItems;
    for (var i = 0, len = genderItems.length; i < len; ++i) {
      genderItems[i].checked = genderItems[i].value == e.detail.value;
    }
    this.setData({
      genderItems: genderItems,
      'formData.contact_gender': e.detail.value
    });
  },
  bindDateChange: function (e) {
    this.setData({
      'formData.leave_date': e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      'formData.leave_time': e.detail.value
    })
  },
  setseats_count: function (e) {
    this.setData({ 'formData.seats_count': e.detail.value })
  },
  setpeople_count: function (e) {
    this.setData({ 'formData.people_count': e.detail.value })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });

  },
  navback: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 提交表单
  formSubmit: function(e) {
    
    let data = e.detail.value;
    data.pc_type = this.data.pubType;
    // 获取本地存储的用户ID
    try {
      // const value = wx.getStorageSync('user_id')
      const value = app.globalData.user_id;

      if (value) {
        data.user_id = value;
        // 检查必填项
        if(!data.departure || !data.destination){
          this.showTopTips('出发地和目的地不能为空');
          return;
        }
        // 是否同意协议
        if(!this.data.isAgree){
          wx.showModal({
            title: '这个很关键',
            content: '请先阅读并同意拼车协议',
            // confirmText: '确定',
            confirmColor: '#09BB07',
            success(res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return;
        }

        wx.request({
          url: app.globalData.requestUrl + '/trip/create',
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
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
      rTypeText: rTypeText,
    });
    // 有id 修改
    var that = this;
    if(options.tripId){
      // 获取详细信息
      wx.request({
        url: app.globalData.requestUrl + '/trip/detail?trip_id='+options.tripId,
        success: function(d) {
          if(d.statusCode==200){
            // 日期 时间 null处理
            if(d.data.leave_date == null){
              d.data.leave_date=''
            }
            if(d.data.leave_time==null){
              d.data.leave_time = ''
            }
            that.setData({
              formData: d.data
            })
            // 性别check
            var genderItems = that.data.genderItems;
            for (var i = 0, len = genderItems.length; i < len; ++i) {
              genderItems[i].checked = genderItems[i].value == d.data.contact_gender;
              that.setData({
                genderItems: genderItems
              });
            }
            // isAgree check
            if(d.data.isAgree == 'agree'){
              that.setData({
                isAgree: true
              });
            }
          }
        }
      })
    }
  },

  // 获取出发位置
  handleDepartureLocation(e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'formData.departure': res.address
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
          'formData.destination': res.address
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