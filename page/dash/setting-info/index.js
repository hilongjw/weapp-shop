const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')
const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
    shop: {
      logo: 'http://77wdm6.com1.z0.glb.clouddn.com/poster.png',
      name: '纯享有机生活超市',
      address: '',
      addressDetail: '建外SOHO西区12号楼1704',
      status: '营业中',
      dispatchTimeStart: '8:00',
      dispatchTimeEnd: '24:00',
      phone: '13800138000',
      dispatchCost: 0,
      dispatchStart: 0
    }
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
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  init () {
    const shop = userData.get('shop') || {}
    this.setData({
      shop: shop
    })
  },
  navToLogo () {
    wx.navigateTo({
      url: '/page/dash/setting-logo/index'
    })
  },
  navToName () {
    wx.navigateTo({
      url: '/page/dash/setting-name/index'
    })
  },
  navToLocation () {
    wx.navigateTo({
      url: '/page/dash/setting-location/index'
    })
  },
  navToQR () {
    wx.navigateTo({
      url: '/page/dash/setting-qr/index'
    })
  }
})