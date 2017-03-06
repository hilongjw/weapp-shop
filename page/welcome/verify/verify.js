Page({
  data:{},
  navToGuide () {
      wx.navigateTo({
        url: '/page/dash/help/index?key=shop-guide'
      })
  },
  navToService () {
      wx.navigateTo({
        url: '/page/dash/help/index'
      })
  }
})