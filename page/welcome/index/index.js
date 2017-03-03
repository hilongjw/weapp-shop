Page({
  data: {
  },
  onLoad (options) {
      this.data.shopId = options.id
  },
  onShareAppMessage: function () {
      return {
          title: '开店 - 这个店',
          path: '/page/welcome/index/index?id=' + this.data.shopId
      }
  },
  navToInit () {
    wx.navigateTo({
      url: '/page/welcome/register/register?id=' + this.data.shopId
    })
  }
})

