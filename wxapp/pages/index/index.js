// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    search: '',
    rotationList: [
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.soogif.com%2Fkak8SN2yWBkq1mxAD6ovhwuJZIsVEMW5.jpeg&refer=http%3A%2F%2Fimg.soogif.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1613760009&t=303bfc3f8a85bb8f413d20692f6d904a',
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2503396486,1505667026&fm=26&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2469087747,1570881900&fm=26&gp=0.jpg',
    ],
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var init_index = app.globalData.school.indexOf(app.globalData.user.school)
    this.setData({
      selectData: app.globalData.school.slice(1, app.globalData.school.length),
      // list: app.globalData.list,
      index: init_index - 1
    })

    if (app.globalData.user.total == -1) {
      wx.navigateTo({
        url: '../information/information',
      })
    }
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
    this.setData({
      index: app.globalData.school.indexOf(app.globalData.user.school) - 1
    })
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
    this.search()
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

  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },

  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  input(e) {
    this.setData({
      search: e.detail.value
    })
  },

  search() {
    var that = this
    var index = this.data.index
    if (index == -2) {
      return
    }

    var data = {
      school: this.data.selectData[index],
      keyword: this.data.search
    }
    console.log(data)
    wx.request({
      url: app.globalData.ip + '/v1/article/search',
      data: {
        data: data
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          'list': res.data
        })
      }
    })
  }
})