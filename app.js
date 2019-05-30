//app.js

import locales from './utils/locales.js';
import T from './utils/i18n.js';
import event from './utils/event.js';

//用 /utils/locales 注册了 locale
T.registerLocale(locales);
//当前语言设置为用户上一次选择的语言，如果是第一次使用，则调用 T.setLocaleByIndex(0) 将语言设置成中文
T.setLocaleByIndex(wx.getStorageSync('langIndex') || 0);
//将 T 注册到 wx 之下，这样在任何地方都可以调用 wx.T.getLanguage() 来得到当前的语言对象了。
wx.T = T;
wx.event = event

App({
  language: '',
  globalData: {
    userInfo: null,
    session_key: null,
    openid: null,
    tab_id: 1,
      serverUrl: "https://studyabroad.anrongkj.com:8443"
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // wx.loadFontFace({
    //   family: 'PingFangSC-Medium',
    //   source: 'url("https://www.your-server.com/PingFangSC-Medium.ttf")',
    //   success: function() {
    //     console.log('load font success')
    //   }
    // })
    //读取系统缓存
    var value = wx.getStorageSync('language')
    //系统缓存不存在
    if (value == "") {
      var res = wx.getSystemInfoSync() //读取手机信息
      this.language = res.language // 这个地方用this
    } else if (value == "zh_CN") {
      console.log("系统缓存为'zh_CN'") //系统缓存为"zh_CN"
      this.language = "zh_CN"
    } else {
      this.language = "zh_EN" //系统缓存为"zh_EN"
    }
  },
  //获取opendid
  getOpenid() {
    let that = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          //code 获取用户信息的凭证
          if (res.code) {
            //请求获取用户openid
            wx.request({
              url: that.globalData.serverUrl + '/wechat/get_openId_sessionKey_unionId',
              data: {
                code: res.code
              },
              success(res) {
                that.globalData.session_key = res.data.data.session_key
                that.globalData.openid = res.data.data.openid
                var res = {
                  status: 200,
                  data: res.data.data.openid,
                  session_key: res.data.data.session_key
                }
                resolve(res);
              }
            });
          } else {
            reject('error');
          }
        }
      })
    });
  }
})