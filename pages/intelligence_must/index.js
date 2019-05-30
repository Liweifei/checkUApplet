//index.js
//获取应用实例
const app = getApp()
import event from '../../utils/event.js';
var majorNum = 0

Page({
  data: {
    selectArray: [{ // 必填专业
      "text": "会计类"
    }, {
      "text": "工程类"
    }],
    classes_array: [ // 必填单选
      {
        index: 0,
        name: 'exam'
      },
      {
        index: 1,
        name: 'no_exam'
      }
    ],
    major: [],
    sat: '',
    toefl: '',
    selectMajorArr: [], // 下拉框选择值
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
  // 下一步
  goSelect() {
    let act = this.data.act
    let sat = this.data.sat
    let toefl = this.data.toefl
    if (act && sat && toefl) {
      wx.setStorageSync('act', act)
      wx.setStorageSync('sat', sat)
      wx.setStorageSync('toefl', toefl)
      wx.navigateTo({
        url: '/pages/intelligence_select/index',
      })
    } else {
      wx.showModal({
        title: this.data.language.fill_tips
      })
    }
  },
  // 添加专业
  add() {
    majorNum++
    let newArr = [{
      name: '专业' + majorNum,
      selectArray: [{ // 必填专业
        "id": "10",
        "text": "会计类"
      }, {
        "id": "21",
        "text": "工程类"
      }]
    }]
    this.setData({
      major: this.data.major.concat(newArr)
    })
  },
  // 减少专业
  minus(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let newArr = Array.from(that.data.major)
    newArr.splice(index, 1)
    this.setData({
      major: newArr
    })
  },
  // sat区域
  satlVal(e) {
    this.setData({
      sat: e.detail.value
    })
  },
  // sat Essay区域
  satEssaylVal(e) {
    this.setData({
      satEssay: e.detail.value
    })
  },
  // act区域
  actlVal(e) {
    this.setData({
      act: e.detail.value
    })
  },
  // toefl区域
  toeflVal(e) {
    this.setData({
      toefl: e.detail.value
    })
  },
  // gpa区域
  gpalVal(e) {
    this.setData({
      gpa: e.detail.value
    })
  },
  // 下拉框
  getData(e) {
    let that = this
    let id = e.currentTarget.id
    let selectMajorArr = this.data.selectMajorArr
    let text = e.detail.text
    let newObj = {
      id: id,
      text: text
    }
    let flag = true
    selectMajorArr.forEach(item => {
      if (item.id == id) {
        flag = false
      } else {
        flag = true
      }
    })
    if (flag) {
      selectMajorArr.push(newObj)
    } else {
      selectMajorArr.splice(id, 1, newObj)
    }
    that.setData({
      selectMajorArr: selectMajorArr
    })
  },
  // 单选按钮
  radiochange(e) {
    console.log(e)
  }
})