// pages/cha't/chat.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    other_avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3155998395,3600507640&fm=26&gp=0.jpg',
    other_id: 2,
    my_avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3155998395,3600507640&fm=26&gp=0.jpg',
    my_id: 1,
    msg: [
      {
        from: 2,
        to: 1,
        message: '你好世界'
      },
      {
        from: 1,
        to: 2,
        message: '你也好世界'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      other_avatar: options.avatar,
      other_id: options.id,
    })
    var that = this
    wx.connectSocket({
      // url: 'ws://jp-tyo-dvm-2.sakurafrp.com:65510',
      url: 'ws://127.0.0.1:8181',
      method: "POST",
      success: res => {
        console.log('小程序连接成功：', res);
        wx.onSocketMessage(function (msg) {
          console.log(msg.data);
          var data = JSON.parse(msg.data)
          that.setData({
            msg: that.data.msg.concat(data)
          })
          console.log(that.data.msg)
        })
      },
      fail: err => {
        console.log('出现错误啦！！' + err);
        wx.showToast({
          title: '网络异常！',
        })
      }
    })
  },

  send() {
    var data = {
      from: 1,
      to: 2,
      message:'发送消息成功'
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data)
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