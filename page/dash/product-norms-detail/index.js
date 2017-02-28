const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

let app = {
  data: {
    norm: {
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
    }
  },
  onLoad (options) {
    if (options.index) {
      this.init(options.index)
    }
  },
  onReady () {
    // 页面渲染完成
  },
  onShow () {
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    this.save()
  },
  save () {
    let product = userData.get('pre-product') || {}
    const index = this.data.index
    let options = this.data.norm.options
    this.data.norm.options = options.filter(item => {
      return item.text
    })
    product.norms[index] = this.data.norm
    userData.set('pre-product', product)
  },
  init (index) {
    const product = userData.get('pre-product') || {}
    const norms = product.norms || []
    index = Number(index)
    const norm = norms[index]

    this.setData({
      index: index,
      norm: norm
    })

    wx.setNavigationBarTitle({
      title: norm.title
    })
  },
  syncInputValue (e) {
    const index = e.target.dataset.index
    const norm = this.data.norm

    norm.options[index].text = e.detail.value

    this.setData({
      norm: norm
    })
  },
  touchItem (e) {
    
  },
  addOption () {
    const norm = this.data.norm
    norm.options.push({
      text: ''
    })
    this.setData({
      norm: norm
    })
  }
}

Page(app)