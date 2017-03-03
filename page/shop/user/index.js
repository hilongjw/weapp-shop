const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
    user: {}
  },
  onLoad:function(options){
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    const user = userData.get('user')
    const userId = user._id
    this.loadUser(userId)
    this.loadLocationList(userId)
  },
  loadUser (userId) {
    Cov({
      url: '/api/user/' + userId
    })
    .then(res => {
      this.setData({
        user: res.data
      })
    })
  },
  loadLocationList (userId) {
    Cov({
      url: '/api/address',
      params: {
        user: userId
      }
    })
    .then(res => {
      this.setData({
        locationList: res.data
      })
    })
  },
  navToLocation (e) {
    let id = e.target.dataset.id
    wx.navigateTo({
        url: '/page/shop/user-location-edit/index'+ (id ? '?id=' + id : '')
    })
  }
})