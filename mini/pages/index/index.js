//index.js
//获取应用实例
const app = getApp()

// 拼车列表
var list = new Array();

Page({
  data: {
    userInfo: {
      user_id:''
    },
    hasUserInfo: false,
    search: {
      leave_date: '',
      departure: '',
      destination: ''
    },
    searchbtn: {
      disabled: false,
      isloading: false,
    },
    hotTripList: [],
    narrow_icon: '<=>',
    tabType: 3,
    // 分页
    curPage: 1,
    totalPage: 1,
    countPerPage: 10,
    searchLoading: true,
    searchLoadingComplete: false
  },
  // 输入搜索文字
  setInputData: function(e) {
    const type = e.currentTarget.dataset.type;
    var that = this;
    if (type == 'departure') {
      that.setData({
        'search.departure': e.detail.value
      })
    } else if (type == 'destination') {
      that.setData({
        'search.destination': e.detail.value
      })
    }
  },
  // 选择日期
  bindDateChange: function (e) {
    this.setData({
      'search.leave_date': e.detail.value
    })
  },
  // 获取位置
  handleLocation(e) {
    const type = e.currentTarget.dataset.type;
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        if(type == 'departure') {
          that.setData({
            'search.departure': res.address
          })
        } else if (type == 'destination') {
          that.setData({
            'search.destination': res.address
          })
        }
        
      }
    })
  },
  // 选择热门路线
  chooseHot: function(e) {
    this.data.search.departure = e.currentTarget.dataset.dep;
    this.data.search.destination = e.currentTarget.dataset.des;

    this.setData({
      'search.destination': e.currentTarget.dataset.des,
      'search.departure': e.currentTarget.dataset.dep
    });
  },
  // 调换出发地目的地
  switchLocation: function() {
    const temp_departure = this.data.search.departure;
    const temp_destination = this.data.search.destination;
    this.data.search.departure = temp_destination;
    this.data.search.destination = temp_departure;
    this.setData({
      'search.destination': temp_departure,
      'search.departure': temp_destination
    })
  },
  // 清空搜索条件
  resetForm: function() {
    this.setData({
      'search.departure':'',
      'search.destination': '',
      'search.leave_date': ''
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 拨打电话
  makeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id 
    })
  },
  // 显示微信号
  showWechatAccount: function(e) {
    const wechatAccount = e.currentTarget.id;
    wx.showModal({
      title: '',
      content: '微信号:' + wechatAccount,
      confirmText: '一键复制',
      confirmColor: '#09BB07',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: wechatAccount,
            success(res) {
              wx.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 复制微信号
  getWechatAccount: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.id,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  // 查询
  searchSubmit: function(e) {
    this.setData({
      // tabType: tabType,
      'searchbtn.isloading': true,
      curPage: 1,
      list: []
    });
    list = [];
    this.fetchList()
  },
  // load more
  getMoreTrip: function() {
    
    this.data.curPage++;
    this.data.searchLoading = true;
    this.setData({
      searchLoading: this.data.searchLoading,
      curPage: this.data.curPage
    });
    this.fetchList();
  },
  // // 获取行程列表
  fetchList: function() {
    
    var that = this;
    const data = {
      page: this.data.curPage,
      tabType: this.data.tabType,
      user_id: this.data.userInfo.user_id,
      search: this.data.search
    }
    wx.request({
      url: app.globalData.requestUrl + '/getTripList',
      data: data,
      success: function (res) {
        if(res.data.length>0) {
          res.data.forEach(function (item) {
            const obj = {
              id: item.id,
              departure: item.departure,
              destination: item.destination,
              contact_gender: item.contact_gender,
              contact_name: item.contact_name,
              contact_phone: item.contact_phone,
              contact_wechat_account: item.contact_wechat_account,
              demo: item.demo,
              leave_date: item.leave_date,
              leave_time: item.leave_time,
              pc_type: item.pc_type,
              people_count: item.people_count,
              price: item.price,
              seats_count: item.seats_count,
              status: item.status,
            }
            list.push(obj);
          })
          that.setData({
            list: list,
            searchLoading: false,
            'searchbtn.isloading': false

          });
        }else{
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true,
            'searchbtn.isloading': false

          });
        }
        
      }
    })
  },
  getHotTrips: function(){
    var that = this;
    const data = {
      user_id: this.data.userInfo.user_id
    }
    wx.request({
      url: app.globalData.requestUrl + '/getHotTrips',
      data: data,
      success: function(res) {
        if(res.data.length>0){
          that.setData({
            hotTripList: res.data
          })
        }
      }
    });
  },
  onReady: function () {
    list = [];
    this.setData({
      list: list,
    });
    wx.showShareMenu({
      withShareTicket: true
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else {
      
    // }
    
    // setdata userid
    var that = this;
    try {
      const value = wx.getStorageSync('user_id')
      // console.log(value)
      // wx.getStorageInfo({
      //   success: function(res) {
      //     console.log(res.data.user_id);
      //   },
      // })
      if (value) {
        that.setData({
          'userInfo.user_id': value
        })
      }
    } catch (e) {
      console.log(e)
    }
    
    // 获取行程列表
    this.fetchList();
    // 获取热门行程列表
    this.getHotTrips();
  },
  // 切换页签
  switchTab: function(e) {
    const tabType = e.currentTarget.id;
    this.setData({
      tabType: tabType,
      curPage: 1,
      list: []
    });
    list = [];
    this.fetchList()
  },
  
  onGotUserInfo: function(e) {
    console.log(e)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: app.globalData.requestUrl + '/mini_login',
            data: {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              signature: e.detail.signature,
              iv: e.detail.iv
            },
            success(res) {
              console.log(res)

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})
