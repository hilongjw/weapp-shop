const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

let page = {
  data: {
    value: ''
  },
  onLoad:function(options){
    if (options.index) {
      this.init(options.index)
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
  init (index) {
   
  },
  save () {
    const product = userData.get('pre-product') || {}
    const norms = product.norms || []
    norms.push({
      title: this.data.value,
      options: []
    })
    product.norms = norms
    userData.set('pre-product', product)
  },
  syncInputValue (e) {
    this.setData({
        value: e.detail.value
    })
  },
  confirm () {
    if (!this.data.value) {
      return this.showTopTip('请输入规格类型名称')
    }
    this.save()
    wx.navigateBack()
  }
}

topTip(page)

Page(page)