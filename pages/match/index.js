//index.js
//获取应用实例
const app = getApp()
import event from '../../utils/event'

Page({
  data: {
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '匹配',
      'Matching'
    ]
  },
  onLoad: function() {
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
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
  }
})