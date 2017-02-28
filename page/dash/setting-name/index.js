const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let page = {
  data:{
    name: ''
  },
  onLoad:function(options){
    
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
  },
  init () {
    const shop = userData.get('shop') || {}
    this.setData({
      name: shop.name
    })
  },
  save () {
    const shop = userData.get('shop') || {}
    shop.name = this.data.name
    userData.set('shop', shop)
    Cov({
      url: '/api/shop/' + shopId,
      method: 'patch',
      data: {
        name: this.data.name
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  syncInputValue (e) {
    this.setData({
        name: e.detail.value
    })
  },
  confirm () {
    this.save()
  }
}

topTip(page)

Page(page)