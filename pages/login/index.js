//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isNewUser: false,
        realName: null,
        count: 0
    },
    onLoad: function() {
        let that = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
            });
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                });
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    console.log(res)
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                        isNewUser: app.globalData.isNewUser,
                    })
                }
            });
        }
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    bindgetuserinfo(e) {
        let backtype = this.data.backType;
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    res.userInfo.headUrl = res.userInfo.avatarUrl;
                    let iv = res.iv;
                    let encryptedData = res.encryptedData;
                    this.setData({
                        userInfo: res.userInfo
                    })
                    let appId = "wx0025163badd18764";
                    let that = this;
                    console.log(res.userInfo)
                    wx.request({
                        method: "POST",
                        url: app.globalData.serverUrl + '/wechat/createByWx',
                        data: {
                            flag: 1,
                            encryptedData: encryptedData,
                            openId: app.globalData.openid,
                            iv: iv,
                            sessionKey: app.globalData.session_key,
                            appId: appId,
                            nickName: app.globalData.userInfo.nickName,
                            headUrl: app.globalData.userInfo.headUrl,
                            sex: app.globalData.userInfo.gender,
                        },
                        success: function(resp) {},
                        fail: function(error) {
                            console.log(error)
                        }
                    });
                }
            })
            wx.switchTab({
                url: '../home/index'
            })
        } else {
            this.showZanTopTips('很遗憾，您拒绝了微信授权，宝宝很伤心');
        }
    }
});