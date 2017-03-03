const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
    start: '08:00',
    end: '23:00'
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.init()
  },
  onHide:function(){
    // this.saveTime()
  },
  onUnload:function(){
    this.saveTime()
  },
  init () {
    const shop = userData.get('shop') || {}

    this.setData({
      start: shop.dispatchTimeStart || '8:00',
      end: shop.dispatchTimeEnd || '23:00'
    })
  },
  saveTime () {
    const shop = userData.get('shop') || {}
    Cov({
      url: '/api/shop/' + shop._id,
      method: 'patch',
      data: {
        dispatchTimeStart: this.data.start,
        dispatchTimeEnd: this.data.end
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  updateTime (e) {
    console.log(e)
    const value = e.detail.value
    const key = e.target.dataset.key

    this.setData({
      [key]: value
    })
  }
})