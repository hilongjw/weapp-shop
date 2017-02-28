const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
const userId = appInstance.globalData.userId
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
    this.loadUser()
    this.loadLocationList()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  loadUser () {
    Cov({
      url: '/api/user/' + userId
    })
    .then(res => {
      this.setData({
        user: res.data
      })
    })
  },
  loadLocationList () {
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
        url: '/page/shop/user-location-edit/index'+ (id ? '?id=' + id : ''),
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