let T = {
  locale: null,
  locales: {}, //语言包内容
  langCode: ['zh_CN', 'zh_EN']
}

T.registerLocale = function(locales) {
  T.locales = locales; //将语言包里的对象赋给当前对象的locales属性
}

T.setLocale = function(code) {
  T.locale = code; //存储当前语言的种类
}

T.setLocaleByIndex = function(index) {
  T.setLocale(T.langCode[index]);
  setTabBarLang(index);
}

T.getLanguage = function() {
  return T.locales[T.locale];
}

// 设置导航栏标题
T.setNavigationBarTitle = function(lastLangIndex, navigationBarTitles) {
  wx.setNavigationBarTitle({
    title: navigationBarTitles[lastLangIndex]
  })
}

let tabBarLangs = [
  [
    '首页',
    '学校',
    '活动',
    '匹配',
    '我的'
  ],
  [
    'Home',
    'School',
    'Activities',
    'Matching',
    'Me'
  ]
];

// 设置 TabBar 语言
function setTabBarLang(index) {
  let tabBarLang = tabBarLangs[index];
  tabBarLang.forEach((element, index) => {
    wx.setTabBarItem({
      'index': index,
      'text': element
    })
  })
}

export default T;