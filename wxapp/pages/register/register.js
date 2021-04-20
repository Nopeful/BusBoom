// pages/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: ''
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

  register: function (e) {
    if (e.detail.value.email == '') {
      wx.showToast({
        title: '请输入您的邮箱！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (e.detail.value.code.length != 6) {
      wx.showToast({
        title: '请六位的验证码！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (e.detail.value.password.length < 6) {
      wx.showToast({
        title: '密码的长度为6-16！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // var that = this
    var data = e.detail.value
    data = {
      msg: app.encode(data.email + ':' + data.password),
      verify_code: data.code
    }
    console.log(data)
    wx.request({
      url: app.globalData.ip + '/v1/client/register',
      data: {
        data: data
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'cookie':wx.getStorageSync("cookie")
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 201) {
          // var id = res.data.id
          // that.setData({
          //   'app.globalData.temp_id': id
          // })
          app.globalData.temp_id = res.data.id
          console.log('temp_id:',app.globalData.temp_id)
          wx.navigateTo({
            url: '../login/login',
          })
          wx.showToast({
            title: '注册成功！',
            duration: 2000
          })
        }
        if (res.statusCode == 401) {
          wx.showToast({
            title: '验证码错误！',
            image: '/images/del.png',
            duration: 1000
          })
        }
      }
    })
  },

  send_code: function (e) {
    if (this.data.email == '') {
      wx.showToast({
        title: '请输入您的邮箱！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var data = { account: this.data.email }
    console.log(data)
    wx.request({
      url: app.globalData.ip + '/v1/client/verify/1',
      data: {
        data: data
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '已发送验证码！',
          duration: 2000
        })
        wx.setStorageSync("cookie", res.header["Set-Cookie"])
      }
    })
  },

  bindemail: function (e) {
    this.setData({
      "email": e.detail.value
    })
  }
})