//school_detail.js
const app = getApp()
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({
    data: {
        sever: app.globalData.serverUrl,
        imgUrls: ['../../static/images/banner1.png', '../../static/images/banner1.png', '../../static/images/banner1.png'],
        indicatorDots: true, //小点
        autoplay: true, //是否自动轮播
        interval: 3000, //间隔时间
        duration: 3000, //滑动时间
        scrollBottomFlag: true,
        showBottomTips: false,
        starMap: ['非常差', '差', '一般', '好', '非常好'],
        morenImg: '../../static/images/moren.png', // 默认头像
        schoolId: '', // 当前学校id
        commentData: [],
        schoolData: {},
        currentEventObj: {}, // 当前页面事件对象
        // 中英文标题切换
        shouldChangeTitle: '',
        navigationBarTitles: [
            '学校详情',
            'Colleges Introductioin'
        ]
    },
    onLoad: function(options) {
        this.setData({
            schoolId: options.id
        });
        //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
        this.setLanguage();
        event.on("languageChanged", this, this.setLanguage);
        // 获取详情
    },
    onShow: function() {
        // 设置语言部分
        if (!!this.data.schoolId) {
            call.getData('/school/school_detail', {
                schoolId: this.data.schoolId,
                userId: app.globalData.userid
            }, this.getSuccess, this.fail);
        }
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
    //图片放大
    imgBig: function(event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = [event.currentTarget.dataset.src]; //获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    // 收藏与取消收藏
    collection(e) {
        let schoolData = this.data.schoolData
        let school = schoolData.school
        school.isCollect = !school.isCollect
        this.setData({
            schoolData: schoolData
        })
        // 收藏与取消收藏请求接口
        if (school.isCollect) {
            this.addCollect(e.currentTarget.id)
        } else {
            this.cancleCollect(e.currentTarget.dataset.cid)
        }
    },
    // 接口调用成功或失败执行函数
    getSuccess(res) {
        if (res.code === '200') {
            var commentStudentList = res.data.commentStudentList[0]
            if (commentStudentList != null) {
                Object.keys(commentStudentList).forEach((item) => {
                    commentStudentList[item] = Number(commentStudentList[item])
                })
                res.data.commentStudentList = commentStudentList
            } else {
                res.data.commentStudentList = {
                    environment: 0,
                    faculty: 0,
                    hardware_facilitie: 0,
                    extracurricular_activity: 0,
                }
            }
            res.data.school = res.data.school[0]
            res.data.school.isCollect = res.data.school.isCollect === 'true' ? true : false
            this.setData({
                schoolData: res.data
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
                    let schoolData = that.data.schoolData
                    let school = schoolData.school
                    school.cid = res.data.cid;
                    that.setData({
                        schoolData: schoolData
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