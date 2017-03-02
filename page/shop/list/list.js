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
  init () {
    Cov({
      url: '/api/shop'
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
        geoHash: hash
      }
    })
    .then(res => {
      let shopList = this.data.shopList
      shopList = shopList.concat(res.data)
      this.setData({
        shopList: shopList
      })
    })
  },
  navToLocation () {
    wx.chooseLocation({
      success: (res) => {
        const hash = geoHash.encode(res.latitude, res.longitude)
        console.log(hash)
        this.nearByShop(hash.substr(0,6))
        this.setData({
            currentLocation: {
              latitude: res.latitude,
              longitude: res.longitude,
              address: res.address + res.name,
              geoHash: hash
            }
        })
      },
      fail (err) {
        console.log(err)
      },
      cancel (err) {
        console.log(err)
      }
    })
  },
  navToShop (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/shop/lobby/lobby?id=' + id
    })
  }
})