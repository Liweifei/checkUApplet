//school.js
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
                id: 0,
                label: 'university'
            },
            {
                id: 1,
                label: 'college'
            },
            {
                id: 2,
                label: 'summer_university'
            }
        ],
        schoolList: [{
                id: 1,
                label: 'hot',
                value: 'hot'
            },
            {
                id: 2,
                label: 'us_news',
                value: 'usnew'
            },
            {
                id: 3,
                label: 'world',
                value: 'world'
            }
        ],
        listSelect: 1,
        schoolSelect: 0,
        currentListVal: 'hot',
        currentCid: '', // 当前cid
        // 列表内容
        contentData: [],
        finishLoad: false, // 图片是否加载完成
        defaultImg: '../../static/images/default.png', // 默认图片地址
        // 中英文标题切换
        shouldChangeTitle: '',
        navigationBarTitles: [
            '学校',
            'School'
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
        this.setLanguage();
        event.on("languageChanged", this, this.setLanguage);
    },
    onShow: function() {
        // 设置语言部分
        this.setData({
            schoolSelect: app.globalData.tab_id
        })
        // 获取列表
        call.getData('/school/getSchoolListByType', {
            ranking: this.data.currentListVal,
            schoolType: this.data.schoolSelect,
            userId: app.globalData.userid
        }, this.getSuccess, this.fail);
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
        that.setData({ // 把选中值放入判断值
            schoolSelect: data.currentTarget.dataset.select
        })
        // 获取列表
        call.getData('/school/getSchoolListByType', {
            ranking: that.data.currentListVal,
            schoolType: that.data.schoolSelect,
            userId: app.globalData.userid
        }, that.getSuccess, that.fail);
    },
    listtab(data) {
        var that = this;
        that.setData({
            listSelect: data.currentTarget.dataset.select,
            currentListVal: data.currentTarget.dataset.val
        })
        // 获取列表
        call.getData('/school/getSchoolListByType', {
            ranking: that.data.currentListVal,
            schoolType: that.data.schoolSelect,
            userId: app.globalData.userid
        }, that.getSuccess, that.fail);
    },
    // 收藏
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
    // 跳转详情页
    goDetail(e) {
        let id = e.currentTarget.id
        wx.navigateTo({
            url: '../school_detail/index?id=' + id
        })
    },
    // 图片加载
    imgLoad(e) {
        this.setData({
            finishLoad: true
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
            url: app.globalData.serverUrl + '/schoolCollect/addSchoolCollect?schoolId=' + id + '&userId=' + app.globalData.userid,
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
                wx.hideLoading()
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
            url: app.globalData.serverUrl + '/schoolCollect/cancelSchoolCollect?collectId=' + id,
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
                wx.showModal({
                    title: '收藏失败'
                })
            },
        })
    }
})