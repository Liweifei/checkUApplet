// activity_detail/index.js
const app = getApp()
import event from '../../utils/event'
var call = require('../../utils/request.js')

Page({
  data: {
    imgUrls: ['../../static/images/banner1.png', '../../static/images/banner1.png', '../../static/images/banner1.png'],
    indicatorDots: true, //小点
    autoplay: true, //是否自动轮播
    interval: 3000, //间隔时间
    duration: 3000, //滑动时间
    scrollBottomFlag: true,
    showBottomTips: false,
    star: [],
    baseInfo: {}, // 基本信息
    commentData: {}, // 评论内容
    currenActivityId: '', // 当前评论内容id
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '评论',
      'Comments'
    ]
  },
  onLoad: function(options) {
    this.setData({
      currenActivityId: options.id
    })
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
  },
  onShow: function() {
    // 设置语言部分
      if (!!this.data.currenActivityId){
          // 获取详情
          call.getData('/activitydetails/selectActivityById', {
              activity_id: this.data.currenActivityId,
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
    console.log(e)
    let baseInfo = this.data.baseInfo
    baseInfo.isCollect = !baseInfo.isCollect
    this.setData({
      baseInfo: baseInfo
    })
    // 收藏与取消收藏请求接口
    if (baseInfo.isCollect) {
      this.addCollect(e.currentTarget.id)
    } else {
      this.cancleCollect(e.currentTarget.dataset.cid)
    }
  },
  // 接口调用成功或失败执行函数
  getSuccess(res) {
    if (res.code === '200') {
        res.activityDetail = res.activityDetail[0]
        if (res.activityDetail != null) {
            res.activityDetail.isCollect = res.activityDetail.isCollect === 'true' ? true : false
            this.setData({
                baseInfo: res.activityDetail,
            })
        }
      this.setData({
        commentData: res.activityCommentList
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
          let baseInfo = that.data.baseInfo
          baseInfo.cid = res.data.cid;
          that.setData({
            baseInfo: baseInfo
          })
          wx.hideLoading()
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