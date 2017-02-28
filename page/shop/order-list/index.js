const orderList = require('./order.js')
const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
const userId = appInstance.globalData.userId

Page({
  data:{
    orderList: orderList
  },
  onLoad:function(options){
    this.loadData()
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
  onPullDownRefresh () {
    console.log('onPullDownRefresh')
  },
  loadData () {
    Cov({
      url: '/api/order',
      params: {
        include: 'shop',
        user: userId
      }
    })
    .then(res => {
      this.setData({
        orderList: res.data
      })
    })
  },
  navToShop (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
        url: '/page/shop/lobby/lobby?id='+ id
    })
  },
  navToDetail (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
        url: '/page/shop/order-detail/index?id='+ id
    })
  }
})