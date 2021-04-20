// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    school: '',
    gender: '',
    avatar: '',
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
    this.setData({
      nickname: app.globalData.user.nickname,
      school: app.globalData.user.school,
      gender: app.globalData.user.gender,
      avatar: app.globalData.user.avatar,
      total: app.globalData.user.total,
    });
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

  gotoinformation() {
    wx.navigateTo({
      url: '../information_alter/information_alter'
    })
  },

  gotoarticles() {
    wx.navigateTo({
      url: '../articles/articles'
    })
  }
})