const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let userId = appInstance.globalData.userId

Page({
  data:{
    locationList: []
  },
  onLoad:function(options){
    userId = appInstance.globalData.userId
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.loadLocationList()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  loadLocationList () {
    Cov({
      url: '/api/address',
      params: {
        user: userId
      }
    })
    .then(res => {
      const currentLocation = userData.get('currentLocation') || {}
      let locationList = res.data

      locationList.forEach(item => {
        if (item._id === currentLocation._id) {
          item.active = true
        } else {
          item.active = false
        }
      })

      this.setData({
        locationList: res.data
      })
    })
  },
  chooseLocation (e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const locationList = this.data.locationList
    let location = locationList[index]
    
    locationList.forEach(item => item.active = false)
    location.active = true

    userData.set('locationList', locationList)
    userData.set('currentLocation', location)

    wx.redirectTo({
      url: '/page/shop/pre-order/index' 
    })
  },
  navToLocation (e) {
    wx.navigateTo({
        url: '/page/shop/user-location-edit/index', 
        success: function(res){
            console.log(res)
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }
    })
  }
})