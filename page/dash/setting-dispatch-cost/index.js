const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let shop = userData.get('shop') || {}
let shopId = shop._id

let page = {
  data:{
    cost: ''
  },
  onLoad:function(options){
    
  },
  onShow:function(){
    this.init()
  },
  init () {
    const shop = userData.get('shop') || {}
    this.setData({
      cost: shop.dispatchCost
    })
  },
  save () {
    shop = userData.get('shop') || {}
    shopId = shop._id
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