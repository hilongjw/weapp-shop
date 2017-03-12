const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
let userId = appInstance.globalData.userId

Page({
  data: {
    skip: 0,
    orderList: []
  },
  onShow:function(){
    userId = appInstance.globalData.userId
    this.data.skip = 0
    this.loadData()
  },
  onPullDownRefresh () {
    this.data.skip = 0
    this.loadData()
  },
  loadMore () {
    this.data.skip += 10
    this.loadData(true)
  },
  loadData (add) {
    Cov({
      url: '/api/order',
      params: {
        limit: 10,
        skip: this.data.skip,
        include: 'shop',
        user: userId
      }
    })
    .then(res => {
      wx.stopPullDownRefresh()
      let orderList = this.data.orderList
      if (add) {
        orderList = orderList.concat(res.data)
      } else {
        orderList = res.data
      }
      this.setData({
        orderList: orderList
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