const app = getApp();
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sever: app.globalData.serverUrl,
    tabs: [{
        name: 'receive',
        type: 'get'
      },
      {
        name: 'mine',
        type: 'send'
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    type: 'get',
    contentData: [],
    morenImg: '../../static/images/moren.png',
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '我的评论',
      'Comments'
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    // 获取列表
    call.getData('/schoolcomment/listmyreply', {
      type: this.data.type,
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
  // 跳转学校详情页面
  goSchoolDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../school_detail/index?id=' + id
    })
  },
  // tab切换
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft * 2,
      activeIndex: e.currentTarget.id,
      type: e.currentTarget.dataset.type
    });
    // 获取列表
    call.getData('/schoolcomment/listmyreply', {
      type: this.data.type,
      userId: app.globalData.userid
    }, this.getSuccess, this.fail);
  },
  // 接口请求成功或失败
  getSuccess(res) {
    this.setData({
      contentData: res.data
    })
  },
  fail(err) {
    console.log(err)
  }
})