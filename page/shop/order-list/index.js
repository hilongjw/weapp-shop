const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
let userId = appInstance.globalData.userId
const formatDateCommon = require('../../../util/util.js').formatDateCommon

Page({
  data: {
    formatDateCommon: formatDateCommon,
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
  orderFormat (order) {
    order.createdAtText = formatDateCommon(order.createdAt)
    return order
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
      const data = res.data.map(this.orderFormat)
      if (add) {
        orderList = orderList.concat(data)
      } else {
        orderList = data
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