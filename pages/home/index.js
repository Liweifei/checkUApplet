//home.js
//获取应用实例
const app = getApp()
var until = require('../../utils/util.js')
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({
    data: {
        sever: app.globalData.serverUrl,
        language: '',
        imgUrls: [],
        indicatorDots: true, //小点
        autoplay: true, //是否自动轮播
        interval: 3000, //间隔时间
        duration: 3000, //滑动时间
        tabData: [{
                index: 0,
                imgSrc: '../../static/images/comprehensiveness.png',
                label: 'university'
            },
            {
                index: 1,
                imgSrc: '../../static/images/sciences.png',
                label: 'college'
            },
            {
                index: 2,
                imgSrc: '../../static/images/summer.png',
                label: 'summer_university'
            }
        ],
        currentTabIndex: 0,
        contentData: [],
        scrollBottomFlag: true,
        showBottomTips: false,
        finishLoad: false, // 图片是否加载完成
        defaultImg: '../../static/images/default.png', // 默认图片地址
        // 中英文标题切换
        shouldChangeTitle: '',
        navigationBarTitles: [
            '小生点U',
            'Check U'
        ]
    },
    onLoad: function() {
        wx.showShareMenu()
        wx.showLoading({
            mask: true,
            title: '加载中',
        })
        //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
        this.setLanguage();
        event.on("languageChanged", this, this.setLanguage);
        // 获取排名列表
        call.getData('/school/list', {}, this.getSuccess, this.fail);
        // 获取轮播图
        call.getData('/school/getHomeImage', {}, this.getLunboSuccess, this.getLunboFail);
        let that = this;
        // 设置登录权限，获取openid
        var onTimeCheck = setInterval(function() {
            if (that.data.count >= 1000) {
                clearTimeout(onTimeCheck);
            }
            console.log(app.globalData.openid)
            if (app.globalData.openid != null) {
                clearTimeout(onTimeCheck);
                that.data.count = 0;
                that.queryEmployeeByOpenId(app.globalData.openid);
            } else {
                wx.showModal({
                    title: '加载中请稍等',
                    icon: 'loading'
                })
            }
            that.data.count++;
        }, 3000);
    },
    onShow: function() {
        if (this.data.shouldChangeTitle) {
            var index = wx.getStorageSync('langIndex') || 0
            wx.T.setNavigationBarTitle(index, this.data.navigationBarTitles);
            this.data.shouldChangeTitle = false;
        }
        // 获取排名列表
        call.getData('/school/list', {}, this.getSuccess, this.fail);
        // 获取轮播图
        call.getData('/school/getHomeImage', {}, this.getLunboSuccess, this.getLunboFail);
    },
    // 查询openId
    queryEmployeeByOpenId(openId) {
        let that = this;
        wx.request({
            url: app.globalData.serverUrl + '/wechat/queryEmployeeByOpenId',
            data: {
                openId: openId
            },
            success: function(resp) {
                wx.hideLoading();
                if (!resp.data.success) {
                    wx.navigateTo({
                        url: '../login/index',
                    })
                } else {
                    console.log(resp)
                    app.globalData.deleteFlag = resp.data.data.deleteFlag
                    app.globalData.userid = resp.data.data.id
                    app.globalData.userInfo = resp.data.data
                    that.setData({
                        headUrl: resp.data.data.headUrl,
                        userName: resp.data.data.nickName
                    })
                    wx.getUserInfo({
                        success: res => {
                            // app.globalData.userInfo = res.userInfo  拿服务器的资料
                            let iv = res.iv;
                            let encryptedData = res.encryptedData;
                            that.setData({
                                userInfo: res.userInfo
                            })
                            let appId = "wx0025163badd18764";
                            wx.request({
                                method: "POST",
                                url: app.globalData.serverUrl + '/wechat/createByWx',
                                data: {
                                    flag: 0,
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
                }
            },
            fail: function(error) {}
        });
    },
    // 创建或者更新用户 0：更新 1：创建
    creatByWx(flag) {
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                this.setData({
                    userInfo: res.userInfo
                })
                let appId = "wx0025163badd18764";
                let that = this;
                wx.request({
                    method: "POST",
                    url: app.globalData.serverUrl + '/wechat/createByWx',
                    data: {
                        flag: flag,
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
    },
    // 设置语言
    setLanguage() {
        this.setData({
            language: wx.T.getLanguage()
        });
        this.data.shouldChangeTitle = true
    },
    // 点击不同学院类型
    tabItem(e) {
        app.globalData.tab_id = e.currentTarget.dataset.index
        wx.switchTab({
            url: '/pages/school/index',
        })
    },
    // 监听页面是否已经滑到最底部
    onReachBottom() {
        let that = this
        that.setData({
            scrollBottom: that.data.nowScrollTop,
            scrollBottomFlag: false,
            showBottomTips: true
        })
    },
    onPageScroll(e) {
        let that = this
        if (that.data.scrollBottomFlag) {
            that.setData({
                nowScrollTop: e.scrollTop
            })
        } else {
            if ((that.data.scrollBottom - e.scrollTop) > 50) {
                that.setData({
                    showBottomTips: false
                })
            }
        }
    },
    // 图片加载
    imgLoad(e) {
        this.setData({
            finishLoad: true
        })
    },
    // 接口调用成功或失败执行函数
    getSuccess(res) {
        this.setData({
            contentData: res
        })
    },
    fail() {
        console.log("失败")
    },
    // 轮播图接口调用成功或失败执行函数
    getLunboSuccess(res) {
        this.setData({
            imgUrls: res.resultMap
        })
    },
    getLunboFail() {
        console.log("失败")
    }
})