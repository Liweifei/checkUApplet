//school_comment.js
//获取应用实例
const app = getApp()
import event from '../../utils/event'
var call = require('../../utils/request.js')
var imgUrl = [];
var imgLengs = 0;

Page({
  data: {
    sever: app.globalData.serverUrl,
    starMap: ['非常差', '差', '一般', '好', '非常好'],
    evaluations: [{
        id: 0,
        name: 'environment',
        star: 0
      },
      {
        id: 1,
        name: 'faculty',
        star: 0
      },
      {
        id: 2,
        name: 'facilities',
        star: 0
      },
      {
        id: 3,
        name: 'activities',
        star: 0
      }
    ],
    textareaValue: '',
    baseInfo: {}, // 头部基本信息
    schoolId: '', // 当前学校id
    files: [],
    // 中英文标题切换
    shouldChangeTitle: '',
    navigationBarTitles: [
      '评论',
      'Comments'
    ]
  },
  onLoad: function(options) {
    this.setData({
      schoolId: options.id
    })
    //来确保用户退出之后重新进入小程序时仍能正常显示当前使用的语言。
    this.setLanguage();
    event.on("languageChanged", this, this.setLanguage);
    // 获取详情
    call.getData('/school/school_detail', {
      schoolId: options.id,
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
  // 是否收藏
  collection() {
    this.setData({
      isCollection: !this.data.isCollection
    })
  },
  //星
  myStarChoose(e) {
    let index = e.currentTarget.dataset.index;
    let star = e.target.dataset.star;
    let evaluations = this.data.evaluations;
    let evaluation = evaluations[index];
    evaluation.star = star;
    evaluation.note = this.data.starMap[star - 1];
    this.setData({
      evaluations: evaluations
    })
  },
  // 上传图片
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        wx.showLoading({
          title: '正在上传',
          icon: 'loading',
          mask: true,
        })
        imgLengs = res.tempFilePaths.length
        for (var i = 0; i < imgLengs; i++) {
          var tempFilesSize = res.tempFiles[i].size; //获取图片的大小，单位B
          if (tempFilesSize <= 2000000) { //图片小于或者等于2M时 可以执行获取图片
            var tempFilePaths = res.tempFilePaths[i]; //获取图片
            that.data.files.push(tempFilePaths); //添加到数组
            that.setData({
              files: that.data.files
            })
            wx.hideLoading()
            console.log(that.data.files)
          } else { //图片大于2M，弹出一个提示框
            wx.hideLoading()
            wx.showModal({
              title: '上传图片不能大于2M!', //标题
              icon: 'none' //图标 none不使用图标，详情看官方文档
            })
          }
        }
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // 删除图片
  deleteImg: function(e) {
    var that = this;
    var imgs = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          imgs.splice(index, 1);
          imgUrl.splice(index, 1)
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          files: imgs
        });
      }
    })
  },
  // 提交评论
  submitComment() {
    let environment = this.data.evaluations[0].star
    let faculty = this.data.evaluations[1].star
    let hardwareFacilitie = this.data.evaluations[2].star
    let extracurricularActivity = this.data.evaluations[3].star
    call.request('/schoolcomment/add', {
      schoolId: this.data.schoolId,
      userId: app.globalData.userid,
      environment: environment,
      faculty: faculty,
      hardwareFacilitie: hardwareFacilitie,
      extracurricularActivity: extracurricularActivity,
      commentDetails: this.data.textareaValue,
    }, this.submitSuccess, this.submitFail);
    // console.log(imgUrl)
    wx.showLoading({
      title: '正在上传',
      icon: 'loading',
      mask: true,
    })
  },
  // 文本区域
  inputVal(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  // 接口调用成功或失败执行函数
  getSuccess(res) {
    if (res.code === '200') {
      this.setData({
        baseInfo: res.data.school[0]
      })
    }
  },
  fail() {
    console.log("失败")
  },
  // 提交成功或失败
  submitSuccess(res) {
    if (res) {
      wx.hideLoading()
      this.setData({
        textareaValue: ''
      })
    } else {
      wx.showModal({
        title: '提交失败!', //标题
        icon: 'none' //图标 none不使用图标，详情看官方文档
      })
    }
  },
  submitFail() {
    wx.showModal({
      title: '提交失败!', //标题
      icon: 'none' //图标 none不使用图标，详情看官方文档
    })
  }
})