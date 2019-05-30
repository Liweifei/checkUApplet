const app = getApp();
import event from '../../utils/event.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    userName: '',
    myListData: [{
        "iconUrl": "../../static/images/collection.png",
        "title": "collection",
        "goUrl": "/pages/my_collect/index"
      },
      {
        "iconUrl": "../../static/images/zan.png",
        "title": "my_likes",
        "goUrl": "/pages/my_zan/index"
      },
      {
        "iconUrl": "../../static/images/comments.png",
        "title": "my_comments",
        "goUrl": "/pages/my_comment/index"
      },
      {
        "iconUrl": "../../static/images/about.png",
        "title": "about_us",
        "goUrl": ""
      }
    ],
    showDialog: false,
    items: [{
        name: '简体中文',
        value: '简体中文',
        checked: false
      },
      {
        name: 'English',
        value: 'English',
        checked: false
      }
    ],
    currentLanuage: 0,
    language: '',
    langIndex: 0,
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '我的',
      'Me'
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    event.on("languageChanged", this, this.setLanguage)
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    if (app.globalData.userInfo) {
        console.log(app.globalData.userInfo)
      this.setData({
        headUrl: app.globalData.userInfo.headUrl,
        userName: app.globalData.userInfo.nickName
      })
    }
  },
  onShow: function() {
    // 设置语言部分
    if (this.data.shouldChangeTitle) {
      var index = wx.getStorageSync('langIndex') || 0
      wx.T.setNavigationBarTitle(index, this.data.navigationBarTitles);
      this.data.shouldChangeTitle = false;
    }
  },
  // 设置语言
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    this.data.shouldChangeTitle = true
  },
  radioChange: function(e) {
    let index = e.detail.value === '简体中文' ? 0 : 1
    wx.T.setLocaleByIndex(index)
    this.setLanguage()
    event.emit('languageChanged')
    wx.setStorage({
      key: 'langIndex',
      data: index
    })
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  freeBack: function() {
    var that = this
    if (this.data.value == 'show') {
      wx.showModal({
        title: '提示',
        content: '你没有选择任何内容',
      })
    }
    that.setData({
      showDialog: !this.data.showDialog
    })
  },
  freetoBack: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '你没有选择任何内容',
    })
    that.setData({
      showDialog: !this.data.showDialog,
      value: 'show',
      checked: false,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})