//activity.js
const app = getApp()
import event from '../../utils/event'

Page({
  data: {
    sever: app.globalData.serverUrl,
    activityData: [],
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '活动',
      'Activities'
    ]
  },
  onLoad: function() {
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    // 活动列表
    this.getActivityList()
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
  goDetail(e) {
    console.log()
    let index = e.currentTarget.dataset.index
    if (index == 0) {
      wx.navigateTo({
        url: '../subject_contest/index'
      })
    }
  },
  // 请求活动列表
  getActivityList() {
    let that = this
    wx.request({
      url: app.globalData.serverUrl + '/activitytype/list',
      data: {
        language: wx.getStorageSync('langIndex') == 0 ? 'zh' : 'en'
      },
      method: 'GET',
      success(res) {
        if (res.data.code === '200') {
          that.setData({
            activityData: res.data.data
          })
        }
      }
    });
  }
})