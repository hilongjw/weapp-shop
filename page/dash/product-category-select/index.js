const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let shop = userData.get('shop') || {}
let shopId = shop._id

let app = {
  data: {
    categoryList: []
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
    const list = this.data.categoryList.filter(item => {
      if (item.selected) {
        values.push(item.name)
      }
      return item.selected
    })
    const product = userData.get('pre-product') || {}
    product.categoryValue = values.join(',')
    product.category = list
    userData.set('pre-product', product)
  },
  init () {
    shop = userData.get('shop') || {}
    shopId = shop._id
    const product = userData.get('pre-product') || {}
    const selectedList = product.category || []
    Cov({
      url: '/api/category/',
      params: {
        ascending: 'index',
        shop: shopId
      }
    })
    .then(res => {
      const categoryList = res.data
      categoryList.forEach(item => {
        selectedList.forEach(check => {
          if (item.name === check.name) {
            item.selected = true
          }
        })
      })
      this.setData({
        categoryList: categoryList
      })
    })
  },
  touchItem (e) {
    const index = e.currentTarget.dataset.index
    const categoryList = this.data.categoryList

    if (categoryList[index].selected) {
      categoryList[index].selected = false
    } else {
      categoryList[index].selected = true
    }

    this.setData({
      categoryList: categoryList
    })
  },
  navToAdd () {
    wx.navigateTo({
      url: '/page/dash/product-category-add/index'
    })
  }
}
Page(app)