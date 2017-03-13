const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')
let shop = userData.get('shop') || {}

const formatDate = require('../../../util/util.js').formatDate
const getDistance = require('../../../vendor/get-distance.js')
const geoHash = require('../../../vendor/geo-hash.js')

Page({
  data:{
    distance: '',
    order: {
      addressDetail: '',
      address: '',
      address: {}
    }
  },
  onLoad:function(options){
    if (options.id) {
      this.init(options.id)
    }
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
      let order = res.data

      order.createdAtText = formatDate(order.createdAt)
      this.setData({
        order: order
      })
    })
  },
  calcDistance (userHash) {
    shop = userData.get('shop') || {}
    const shopGeoHash = shop.geoHash
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
  doneOrder () {
    Cov({
      url: '/api/order/' + this.data.order._id,
      method: 'patch',
      data: {
        status: 'done'
      }
    })
    .then(res => {
      wx.showToast({
        title: '订单完成',
        icon: 'success',
        duration: 2000
      })
      let order = this.data.order
      order.status = 'done'
      this.setData({
        order: order
      })
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
      order.status = 'cancel'
      this.setData({
        order: order
      })
    })
  }
})