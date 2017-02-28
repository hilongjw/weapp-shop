const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let page = {
  data: {
    category: ''
  },
  onLoad:function (options){
    if (options.id) {
      this.init(options.id)
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
  },
  init (id) {
    Cov({
      url: '/api/category/' + id
    })
    .then(res => {
      const category = res.data
      this.setData({
        id: id,
        category: category.name
      })
    })
  },
  save (id, text) {
    const categoryList = userData.get('dash-product-category') || []

    Cov({
      url: '/api/category/' + (id ? id : ''),
      method: id ? 'patch' : 'post',
      data: {
        name: this.data.category,
        index: categoryList.length + 1,
        shop: shopId
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  syncInputValue (e) {
    this.setData({
        category: e.detail.value
    })
  },
  confirm () {
    this.save(this.data.id) 
  }
}

topTip(page)

Page(page)