const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{},
  onLoad:function(options){
    if (options.id) {
      this.initOrder(options.id)
      this.data.id = options.id
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  initOrder (id) {
    Cov({
      url: 'api/order/' + id,
      params: {
        include: 'address,user,shop,products'
      }
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
      url: '/page/shop/order-detail/index?id' + this.data.id 
    })
  }
})