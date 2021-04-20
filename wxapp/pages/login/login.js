// pages/login/login.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

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

  },

  login: function (e) {
    if (e.detail.value.account == '') {
      wx.showToast({
        title: '请输入您的账号！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (e.detail.value.password == '') {
      wx.showToast({
        title: '请输入您的密码！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var that = this;
    var data = e.detail.value
    console.log(data)
    var base64 = app.encode(data.account + ':' + data.password)
    console.log(base64)
    wx.request({
      url: app.globalData.ip + '/v1/token',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'basic ' + base64
      },
      success: function (res) {
        if (res.statusCode == 201) {
          console.log(res.data);
          // that.setData({
          //   'app.globalData.user': res.data,
          // })
          app.globalData.user = res.data
          that.gotoindex()
        }
        else {
          that.login_fail()
        }
      }
    })

  },

  gotoregister: function (e) {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  gotoresetpsw: function (e) {
    wx.navigateTo({
      url: '../resetpsw/resetpsw',
    })
  },

  gotoindex: function (e) {
    wx.switchTab({
      url: '../index/index',
    })
    wx.showToast({
      title: '登录成功！',
      duration: 2000
    })
  },

  login_fail() {
    wx.showToast({
      title: '账号或密码错误！',
      image: '/images/del.png',
      duration: 1000
    })
  }
})  