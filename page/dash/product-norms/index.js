const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

let app = {
  data: {
    norms: [{
        id: '23123',
        title: '杯型',
        options: [{
            text: '中杯',
            active: false
        }, {
            text: '大杯',
            active: false
        }, {
            text: '超大杯',
            active: false
        }]
    }, {
        id: '2333',
        title: '花纹',
        options: [{
            text: '玫瑰',
            active: false
        }, {
            text: '竹叶',
            active: false
        }, {
            text: 'Out',
            active: false
        }, {
            text: '玫瑰',
            active: false
        }, {
            text: '竹叶',
            active: false
        }, {
            text: 'Out',
            active: false
        }]
    }]
  },
  onLoad (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady () {
    // 页面渲染完成
  },
  onShow () {
    this.init()
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    this.save()
  },
  save () {
    let values = []
    const norms = this.data.norms
    norms.forEach(item => {
      values.push(item.title)
    })
    const product = userData.get('pre-product') || {}
    product.normsValue = values.join(',')
    product.norms = norms
    userData.set('pre-product', product)
  },
  init () {
    const product = userData.get('pre-product') || {}
    const norms = product.norms || []
    console.log(product)
    this.setData({
      norms: norms
    })
  },
  touchItem (e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/page/dash/product-norms-detail/index?index=' + index
    })
  },
  navToAdd () {
    wx.navigateTo({
      url: '/page/dash/product-norms-add/index'
    })
  }
}
Page(app)