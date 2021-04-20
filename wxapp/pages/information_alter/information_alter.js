// pages/detai/detai.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    avatar: '',
    avatar_base64: '',
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    show2: false,
    selectData: [],
    selectData2: ['小哥哥', '小姐姐'],//下拉列表的数据
    index: 0,
    index2: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectData: app.globalData.school
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
    this.setData({
      name: app.globalData.user.nickname,
      avatar: 'data:image/png;base64,' + app.globalData.user.avatar,
      avatar_base64: app.globalData.user.avatar,
      index: app.globalData.school.indexOf(app.globalData.user.school),
      index2: ['小哥哥', '小姐姐'].indexOf(app.globalData.user.gender)
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

  selectTap2() {
    this.setData({
      show2: !this.data.show2
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

  optionTap2(e) {
    let Index2 = e.currentTarget.dataset.index;
    console.log(Index2)
    this.setData({
      index2: Index2,
      show2: !this.data.show2
    });
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var avatar_base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        avatar_base64 = avatar_base64.replace(/[\r\n]/g, '')
        that.setData({
          avatar: res.tempFilePaths[0],
          avatar_base64: avatar_base64
        })
        wx.showToast({
          title: '上传成功！',
          duration: 1000
        })
      }
    })
  },
  register(e) {
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请输入您的昵称！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.selectData[this.data.index] == '选择您的学校') {
      wx.showToast({
        title: '请选择您的学校！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // var that = this
    var data = {
      id: app.globalData.user.id,
      token: app.globalData.user.token,
      nickname: e.detail.value.name,
      school: this.data.selectData[this.data.index],
      gender: this.data.selectData2[this.data.index2],
      avatar: this.data.avatar_base64,
      total: app.globalData.user.total
    }
    console.log(data)
    wx.request({
      url: app.globalData.ip + '/v1/client/alter',
      data: {
        data: data
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'BusBoom ' + app.globalData.user.token
      },
      success: function (res) {
        if (res.data.error_code == 0) {
          // that.setData({
          //   'app.globalData.user': data
          // })
          app.globalData.user = data
          wx.switchTab({
            url: '../index/index',
          })
          wx.showToast({
            title: '信息修改成功！',
            duration: 2000
          })
        }
        if (res.data.error_code != 0) {
          if(res.data.msg.nickname){
            wx.showToast({
              title: res.data.msg.nickname[0],
              icon: 'none',
              duration: 2000
            })
          }
          if(res.data.msg.avatar){
            wx.showToast({
              title: res.data.msg.avatar[0],
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })
  }
})