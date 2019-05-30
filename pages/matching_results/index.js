//index.js
//获取应用实例
const app = getApp()
import event from '../../utils/event.js'
var call = require('../../utils/request.js')

Page({
  data: {
    matchData: {
      dreamSchool: [{
          num: 1,
          name: '普林斯顿大学',
          percent: '10.5%'
        },
        {
          num: 2,
          name: '哈佛大学',
          percent: '9.1%'
        },
        {
          num: 3,
          name: '哥伦比亚大学',
          percent: '8.5%'
        }
      ],
      matchSchool: [{
          num: 1,
          name: '芝加哥大学',
          percent: '99.5%'
        },
        {
          num: 2,
          name: '耶鲁大学',
          percent: '99.1%'
        },
        {
          num: 3,
          name: '麻省理工大学',
          percent: '88.5%'
        }
      ],
      safeSchool: [{
          num: 1,
          name: '加州理工大学',
          percent: '100%'
        },
        {
          num: 2,
          name: '南加州大学',
          percent: '100%'
        },
        {
          num: 3,
          name: '密歇根大学',
          percent: '95%'
        }
      ]
    },
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '匹配结果',
      'Matching result'
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
    // 获取列表
    let act = wx.getStorageSync("act")
    let sat = wx.getStorageSync("sat")
    let toefl = wx.getStorageSync("toefl")
    call.getData('/school/getMatching', {
      act: act,
      sat: sat,
      toefl: toefl
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
  goDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../school_detail/index?id=' + id
    })
  },
  // 接口调用成功或失败执行函数
  getSuccess(res) {
    if (res.code === '200') {
      this.setData({
        matchData: res.data
      })
    }
  },
  fail() {
    console.log("失败")
  }
})