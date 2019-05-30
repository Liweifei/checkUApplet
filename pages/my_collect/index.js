const app = getApp();
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sever: app.globalData.serverUrl,
    navData: [{
        text: 'university',
        id: 0,
        type: 'school'
      },
      {
        text: 'college',
        id: 1,
        type: 'school'
      },
      {
        text: 'summer_university',
        id: 2,
        type: 'school'
      },
      {
        text: 'activity',
        id: 3,
        type: 'activity'
      }
    ],
    currentTab: 0,
    collectType: 'school',
    navScrollLeft: 0,
    contentData: [],
    finishLoadFlag: true, // 图片是否加载完成
    searchText: '', // 搜索条件
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '我的收藏',
      'Collection'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    // 获取我的收藏列表
    call.request('/schoolCollect/getSchoolListByEmploeeId', {
      schoolType: this.data.currentTab,
      schoolName: this.data.searchText,
      collectType: this.data.collectType,
      userId: app.globalData.userid
    }, this.getSuccess, this.getFail);
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
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        collectType: event.currentTarget.dataset.type
      })
    }
    // 获取我的收藏列表
    call.request('/schoolCollect/getSchoolListByEmploeeId', {
      schoolType: this.data.currentTab,
      schoolName: this.data.searchText,
      collectType: this.data.collectType,
      userId: app.globalData.userid
    }, this.getSuccess, this.getFail);
  },
  // 切换tab
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },
  // 回车搜索事件
  search(e) {
    this.setData({
      searchText: e.detail.value
    })
    // 获取我的收藏列表
    call.request('/schoolCollect/getSchoolListByEmploeeId', {
      schoolType: this.data.currentTab,
      schoolName: this.data.searchText,
      collectType: this.data.collectType,
      userId: app.globalData.userid
    }, this.getSuccess, this.getFail);
  },
  getSuccess(res) {
    if (res.code === 200) {
      if (res.collectList) {
        this.setData({
          contentData: res.collectList
        })
      }
    }
  },
  getFail() {
    console.log('获取失败')
  }
})