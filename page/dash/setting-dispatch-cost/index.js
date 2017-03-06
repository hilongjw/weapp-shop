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
    shop = userData.get('shop') || {}
    shopId = shop._id
    console.log('save cost', this.data.cost)
    Cov({
      url: '/api/shop/' + shopId,
      method: 'patch',
      data: {
        dispatchCost: this.data.cost
      }
    })
    .then(res => {
      console.log(res)
      wx.navigateBack()
    })
    .catch(e => {
      console.log(e)
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