const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
const shopGeoHash = appInstance.globalData.geoHash

const getDistance = require('../../../vendor/get-distance.js')
const geoHash = require('../../../vendor/geo-hash.js')

Page({
  data:{
    distance: '',
    order: {}
  },
  onLoad:function(options){
    if (options.id) {
      this.init(options.id)
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
  init (id) {
    Cov({
      url: '/api/order/' + id,
      params: {
        include: 'address'
      }
    })
    .then(res => {
      this.calcDistance(res.data.address.geoHash)
      this.setData({
        order: res.data
      })
    })
  },
  calcDistance (userHash) {
    let shop = geoHash.decode(shopGeoHash)
    let user = geoHash.decode(userHash)

    let distance = getDistance(shop.latitude, shop.longitude, user.latitude, user.longitude)
    distance = Math.floor(distance)
    
    this.setData({
      distance: distance
    })
  },
  callPhone (e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  confirmOrder () {
    Cov({
      url: '/api/order/' + this.data.order._id,
      method: 'patch',
      data: {
        status: 'sending'
      }
    })
    .then(res => {
      wx.showToast({
        title: '接单成功',
        icon: 'success',
        duration: 2000
      })
      let order = this.data.order
      order.status = 'sending'
      this.setData({
        order: order
      })
    })
  },
  cancelOrder () {
    Cov({
      url: '/api/order/' + this.data.order._id,
      method: 'patch',
      data: {
        status: 'cancel'
      }
    })
    .then(res => {
      wx.showToast({
        title: '取消订单',
        icon: 'success',
        duration: 2000
      })
      let order = this.data.order
      order.status = 'sending'
      this.setData({
        order: order
      })
    })
  }
})