//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad: function() {
    // 展示本地存储能力
    let that = this;
    // 登录
    wx.showLoading({
      title: '加载中',
    })
    app.getOpenid().then(function(res) {
      if (res.status == 200) {
        wx.switchTab({
          url: '../home/index'
        })
        wx.hideLoading()
      }
    });
  }
});