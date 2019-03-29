//获取应用实例
const app = getApp()
// 拼车列表
var list = new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      user_id: ''
    },
    list: [],
    // 分页
    curPage: 1,
    totalPage: 1,
    countPerPage: 10,
    searchLoading: true,
    searchLoadingComplete: false
  },
  // load more
  getMoreTrip: function () {

    this.data.curPage++;
    this.data.searchLoading = true;
    this.setData({
      searchLoading: this.data.searchLoading,
      curPage: this.data.curPage
    });
    this.fetchList();
  },
  // 获取行程列表
  fetchList: function () {

    var that = this;
    const value = wx.getStorageSync('user_id');
    // const value = app.globalData.user_id;

    const data = {
      page: this.data.curPage,
      user_id: value,
    }
    wx.request({
      url: app.globalData.requestUrl + '/myTripList',
      data: data,
      success: function (res) {
        if (res.data.length > 0) {
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
        } else {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true,
            'searchbtn.isloading': false

          });
        }

      }
    })
  },
  editItem: function (e){
    const id = e.currentTarget.id;
    const type = e.currentTarget.dataset.type;
    let typetext ='';
    if(type == 1){
      typetext='passenger'
    }else if(type==2){
      typetext = 'driver'
    }
    wx.redirectTo({
      url: '/pages/newTrip/newTrip?type='+typetext+'&tripId='+id
    })
  },
  deleteItem: function(e) {
    var that = this;
    const id = e.currentTarget.id;
    wx.showModal({
      title: '',
      content: '确定删除该行程吗?',
      confirmText: '确定',
      confirmColor: '#09BB07',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestUrl + '/trip/delete'+'?tripId='+id,
            success: function (d) {
              if (d.data.info == 'success') {
                wx.showToast({
                  title: d.data.message,
                  icon: 'success',
                  duration: 2000
                });
                // 从行程列表中删除
                list = list.filter(function(val){
                  return val.id != id;
                });
                that.setData({
                  list:list
                })
                
              }else {
                wx.showModal({
                  title: '',
                  content: d.data.message,
                  confirmText: '确定',
                  confirmColor: '#09BB07',
                  success(res){

                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const value = wx.getStorageSync('user_id')
    if (!value) {
      wx.redirectTo({
        url: "/pages/toolpages/login",
      })
    }
    list = [];
    this.setData({
      list: list,
    });
    wx.showShareMenu({
      withShareTicket: true
    });
    // setdata userid
    var that = this;
    try {
      const value = wx.getStorageSync('user_id')
      // const value = app.globalData.user_id;

      // console.log(value)
      // wx.getStorageInfo({
      //   success: function(res) {
      //     console.log(res.data.user_id);
      //   },
      // })
      if (!value) {
        wx.redirectTo({
          url: "/pages/toolpages/login",
        })
      }
    } catch (e) {
      console.log(e)
    }
    // 获取行程列表
    this.fetchList();
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