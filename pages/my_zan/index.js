const app = getApp();
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    userName: '',
    zanCount: 0,
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '我的赞',
      'My likes'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    if (app.globalData.userInfo) {
      this.setData({
        headUrl: app.globalData.userInfo.headUrl,
        userName: app.globalData.userInfo.nickName
      })
    }
    // 接口请求
    call.getData('/sysEmployee/getSupportCount', {
      userId: app.globalData.userid
    }, this.getSuccess, this.fail);
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
  // 接口请求成功或失败
  getSuccess(res) {
    this.setData({
      zanCount: res.supportCount
    })
  },
  fail(err) {
    console.log(err)
  }
})