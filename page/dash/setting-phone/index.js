const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let page = {
  data:{
    phone: ''
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
  init () {
    const shop = userData.get('shop') || {}
    this.setData({
      phone: shop.phone
    })
  },
  save () {
    Cov({
      url: '/api/shop/' + shopId,
      method: 'patch',
      data: {
        phone: this.data.phone
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  syncInputValue (e) {
    const key = e.target.dataset.key
    this.setData({
        [key]: e.detail.value
    })
  },
  confirm () {
    this.save()
  }
}

topTip(page)

Page(page)