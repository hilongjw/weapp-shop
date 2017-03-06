const dashTab = require('../../common/components/dash-tab/index.js')

const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

const shopDefault = {
  logo: '',
  name: '',
  address: '',
  addressDetail: '',
  status: '营业中',
  dispatchTimeStart: '8:00',
  dispatchTimeEnd: '24:00',
  phone: '',
  dispatchCost: 0,
  dispatchStart: 0
}

let app = {
  data:{
    shop: {}
  },
  onShow:function() {
    this.setTabBarActive('shop')
    console.log()
    this.init('setting ----- shop')
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
      if (!shop.open) {
        return wx.redirectTo({
          url: '/page/welcome/verify/verify'
        })
      }
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