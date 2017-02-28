const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let page = {
  data:{
    cost: ''
  },
  onLoad:function(options){
    
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
    const shop = userData.get('shop') || {}
    this.setData({
      cost: shop.dispatchCost
    })
  },
  save () {
    Cov({
      url: '/api/shop/' + shopId,
      method: 'patch',
      data: {
        dispatchCost: this.data.cost
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  syncInputValue (e) {
    this.setData({
        cost: e.detail.value
    })
  },
  confirm () {
    this.save()
  }
}

topTip(page)

Page(page)