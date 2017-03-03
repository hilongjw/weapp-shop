const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

let page = {
  data:{
    start: ''
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
    // 页面关闭
  },
  init () {
    const shop = userData.get('shop') || {}
    this.setData({
      start: shop.dispatchStartPrice
    })
  },
  save () {
    const shop = userData.get('shop') || {}
     Cov({
      url: '/api/shop/' + shop._id,
      method: 'patch',
      data: {
        dispatchStartPrice: this.data.start
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  syncInputValue (e) {
    this.setData({
        start: e.detail.value
    })
  },
  confirm () {
    this.save()
  }
}

topTip(page)

Page(page)