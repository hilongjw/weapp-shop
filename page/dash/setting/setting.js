const dashTab = require('../../common/components/dash-tab/index.js')

const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

const shopDefault = {
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

let app = {
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
    console.log('setting show')
    this.setTabBarActive('shop')
    this.init()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  init () {
    this.loadShop()
  },
   onShareAppMessage: function () {
      return {
          title: this.data.shop.name + ' - 这个店',
          path: '/page/shop/lobby/lobby?id=' + this.data.shop._id
      }
  },
  loadShop () {
    const user = userData.get('user')
    const shopId = user.shop
    Cov({
      url: '/api/shop/' + shopId
    })
    .then(res => {
      let shop = res.data
      userData.set('shop', shop)
      this.setData({
        shop: shop
      })
    })
  },
  navToInfo () {
    wx.navigateTo({
      url: '/page/dash/setting-info/index'
    })
  },
  navToStatus () {
    wx.navigateTo({
      url: '/page/dash/setting-status/index'
    })
  },
  navToDispatchTime () {
    wx.navigateTo({
      url: '/page/dash/setting-dispatch-time/index'
    })
  },
  navToPhone () {
    wx.navigateTo({
      url: '/page/dash/setting-phone/index'
    })
  },
  navToHelp () {
    wx.navigateTo({
          url: '/page/dash/help/index'
        })
  },
  navToDispatchStart () {
    wx.navigateTo({
      url: '/page/dash/setting-dispatch-start/index'
    })
  },
  navToDispatchCost () {
    wx.navigateTo({
      url: '/page/dash/setting-dispatch-cost/index'
    })
  },
}

dashTab(app)
Page(app)