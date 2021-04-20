// pages/article/article.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    imageListBase64: [],
    title: '',
    content: ''
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

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.addNewImage(res.tempFilePaths);
        var imagebase64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        imagebase64 = imagebase64.replace(/[\r\n]/g, '')
        that.setData({
          imageListBase64: that.data.imageListBase64.concat(imagebase64)
        })
        wx.showToast({
          title: '上传成功！',
        })
      }
    })
  },

  thisImage: function (e) {
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  },

  deleteImage: function (e) {
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    list.splice(index, 1)
    this.setData({
      imageList: list
    })
  },

  addNewImage(imagePath) {
    var list = this.data.imageList
    list = list.concat(imagePath)
    this.setData({
      imageList: list
    })
  },

  bindtitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindcontent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  publish() {
    if (this.data.title == '') {
      wx.showToast({
        title: '请填写商品的标题！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.content == '') {
      wx.showToast({
        title: '请填写商品描述！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.imageListBase64.length == 0) {
      wx.showToast({
        title: '请上传商品的图片！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var data = {
      id: app.globalData.user.id,
      title: this.data.title,
      content: this.data.content,
      images: this.data.imageListBase64,
    }
    var that = this
    console.log(data)
    wx.request({
      url: app.globalData.ip + '/v1/article/publish',
      data: {
        data: data
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'BusBoom ' + app.globalData.user.token
      },
      success: function (res) {
        if (res.statusCode == 201) {
          wx.switchTab({
            url: '../index/index',
          })
          wx.showToast({
            title: '发布交易成功！',
            duration: 2000
          })
          that.setData({
            imageList: [],
            imageListBase64: [],
            title: '',
            content: '',
          })
          app.globalData.user.total= app.globalData.user.total + 1
        }
      }
    })
  }
})
