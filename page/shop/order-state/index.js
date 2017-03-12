const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{},
  onLoad:function(options){
    if (options.id) {
      this.data.id = options.id
    }
  },
  initOrder (id) {
    Cov({
      url: 'api/order/' + id
    })
    .then(res => {
      let order = res.data
      this.setData({
        order: order
      })
    })
  },
  navToOrder () {
    wx.redirectTo({
      url: '/page/shop/order-detail/index?id=' + this.data.id
    })
  }
})