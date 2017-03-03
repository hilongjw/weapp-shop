const dragAble = require('../../../util/drag.js')
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
    
  },
  dragHookEnd (item, list) {
    console.log(item, list)
    this.diffIndex(list, true)
  },
  diffIndex (newList, save) {
    const oldList = this.data.oldList
    let tmp
    oldList.forEach((old, i) => {
      newList.forEach((item, j) => {
        if (old._id === item._id && i !== j) {
          if (save) {
            this.saveIndex(item._id, j)
          }
        }
      })
    })
    this.data.oldList = JSON.parse(JSON.stringify(newList))
  },
  init () {
    shop = userData.get('shop') || {}
    shopId = shop._id
    Cov({
      url: '/api/category/',
      params: {
        ascending: 'index',
        shop: shopId
      }
    })
    .then(res => {
      const list = res.data
      this.setData({
        categoryList: list,
        oldList: list
      })
      userData.set('dash-product-category', list)
    })
  },
  saveIndex (id, index) {
    Cov({
      url: '/api/category/' + id,
      method: 'patch',
      data: {
        index: index
      }
    }).then(res => {
      console.log('saved')
    })
  },
  navToEdit (e) {
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/dash/product-category-add/index?id=' + id
    })
  },
  navToAdd () {
    wx.navigateTo({
      url: '/page/dash/product-category-add/index'
    })
  }
}
 
dragAble(app, 'categoryList', true)
Page(app)