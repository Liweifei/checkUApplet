//subject_contest.js
const app = getApp()
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sever: app.globalData.serverUrl,
        schoolData: [{
                id: 1,
                label: 'all'
            },
            {
                id: 2,
                label: 'home'
            },
            {
                id: 3,
                label: 'overseas'
            }
        ],
        schoolList: [{
                id: 1,
                label: 'all'
            },
            {
                id: 2,
                label: 'math'
            },
            {
                id: 3,
                label: 'physics'
            },
            {
                id: 4,
                label: 'chemistry'
            },
            {
                id: 5,
                label: 'biology'
            }
        ],
        listSelect: 1,
        schoolSelect: 1,
        currentCid: '', // 当前cid
        finishLoadFlag: true, // 图片是否加载完成
        // 列表内容
        contentData: [],
        local: '', // 国内/国外
        subjectType: '', // 科目 
        // 中英文标题切换
        shouldChangeTitle: '',
        navigationBarTitles: [
            '学科',
            'Subject'
        ]
    },
    onLoad: function() {
        //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
        this.setLanguage();
        event.on("languageChanged", this, this.setLanguage);
        // 获取列表
        call.getData('/activitydetails/selectActivityByType', {
            local: this.data.local,
            subjectType: this.data.subjectType,
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
    schooltab(data) {
        var that = this;
        that.setData({ //把选中值放入判断值
            schoolSelect: data.currentTarget.dataset.select
        })
    },
    listtab(data) {
        var that = this;
        that.setData({
            listSelect: data.currentTarget.dataset.select
        })
    },
    collectionbtn(e) {
        // 收藏与取消收藏切换
        let index = e.currentTarget.dataset.index
        let contentDatas = this.data.contentData;
        let contentData = contentDatas[index];
        contentData.isCollect = !contentData.isCollect;
        this.setData({
            contentData: contentDatas,
            currentCid: index
        })
        // 收藏与取消收藏请求接口
        if (contentData.isCollect) {
            this.addCollect(e.currentTarget.id)
        } else {
            this.cancleCollect(e.currentTarget.dataset.cid)
        }
    },
    goDetail(e) {
        let id = e.currentTarget.id
        wx.navigateTo({
            url: '../activity_detail/index?id=' + id
        })
    },
    // 接口调用成功或失败执行函数
    getSuccess(res) {
        if (res.code === '200') {
            for (let index in res.data) {
                res.data[index].isCollect = res.data[index].isCollect === 'true' ? true : false
            }
            this.setData({
                contentData: res.data
            })
        }
    },
    fail() {
        console.log("失败")
    },
    // 添加和取消收藏
    addCollect(id) {
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        wx.request({
            url: app.globalData.serverUrl + '/activityCollect/addActivityCollect?activityId=' + id + '&userId=' + app.globalData.userid,
            method: 'POST',
            success(res) {
                if (res.data.code == 200) {
                    wx.hideLoading()
                    let index = that.data.currentCid
                    let contentDatas = that.data.contentData;
                    let contentData = contentDatas[index];
                    contentData.cid = res.data.cid;
                    that.setData({
                        contentData: contentDatas
                    })
                    wx.showToast({
                        title: '收藏成功！',
                        icon: "success"
                    })
                }
            },
            fail(err) {
                wx.showModal({
                    title: '收藏失败'
                })
            },
        })
    },
    cancleCollect(id) {
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        wx.request({
            url: app.globalData.serverUrl + '/activityCollect/cancelActivityCollect?collectId=' + id,
            method: 'POST',
            success(res) {
                if (res.data.code == 200) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '取消成功！',
                        icon: "success"
                    })
                }
            },
            fail(err) {
                wx.hideLoading()
                wx.showModal({
                    title: '收藏失败'
                })
            },
        })
    }
})