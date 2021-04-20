// pages/articles/articles.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        // title:'啦啦啦啦啦啦啦啦',
        title:'啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
        content:'啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
        publish_time:'2020/1/1 20:50:60'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search()
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

  search() {
    var that = this
    wx.request({
      url: app.globalData.ip + '/v1/article/' + app.globalData.user.id,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'BusBoom ' + app.globalData.user.token
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          'list': res.data
        })
      }
    })
  },

  delete(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var id = e.currentTarget.dataset.item
          var uid = app.globalData.user.id
          var list = that.data.list
          wx.request({
            url: app.globalData.ip + '/v1/article/delete/' + uid + '/' + id,
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              'Authorization': 'BusBoom ' + app.globalData.user.token
            },
            success: function (res) {
              for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                  list.splice(i, 1)
                  break
                }
              }
              that.setData({
                'list': list
              })
              app.globalData.user.total = app.globalData.user.total - 1
              wx.showToast({
                title: '文章已删除！',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})