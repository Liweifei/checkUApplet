//index.js
//获取应用实例
const app = getApp()
import event from '../../utils/event.js';

Page({
  data: {
    selectData: [{ // 选填数据
        name: 'area',
        list: [{
            id: '0',
            text: '美国东部'
          },
          {
            id: '1',
            text: '美国西部'
          }
        ]
      },
      {
        name: 'category',
        list: [{
            id: '0',
            text: '综合性大学'
          },
          {
            id: '1',
            text: '文理学院'
          }
        ]
      },
      {
        name: 'environment',
        list: [{
            id: '0',
            text: '城市'
          },
          {
            id: '1',
            text: '乡村'
          }
        ]
      },
      {
        name: 'fee',
        list: [{
            id: '0',
            text: '0~10000'
          },
          {
            id: '1',
            text: '10000~20000'
          }
        ]
      }
    ],
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '智能匹配',
      'Intelligent Matching'
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
  // 匹配
  match() {
    wx.navigateTo({
      url: '/pages/matching_results/index',
    })
  }
})