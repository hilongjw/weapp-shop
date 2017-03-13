const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let userId = appInstance.globalData.userId

const geoHash = require('../../../vendor/geo-hash.js')

Page({
  data:{
    currentLocation: {},
    shopList: []
  },
  onLoad:function(options){
    userId = appInstance.globalData.userId
    this.init()
  },
  onShow () {
    this.initCurrentLocation()
  },
  init () {
    Cov({
      url: '/api/shop',
      params: {
        open: true
      }
    })
    .then(res => {
      this.setData({
        shopList: res.data
      })
    })
  },
  nearByShop (hash) {
    Cov({
      url: '/api/shop',
      data: {
        geoHash: hash,
        open: true
      }
    })
    .then(res => {
      this.setData({
        nearList: res.data
      })
    })
  },
  initCurrentLocation () {
    const currentLocation = userData.get('currentLocation') || {}
    if (currentLocation.geoHash) {
      this.nearByShop(currentLocation.geoHash)
    }
    this.setData({
      currentLocation: currentLocation
    })
  },
  navToLocation () {
    wx.navigateTo({
        url: '/page/shop/user-location/index'
    })
  },
  navToShop (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/shop/lobby/lobby?id=' + id
    })
  }
})