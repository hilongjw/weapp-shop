const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let shop = userData.get('shop') || {}
let shopId = shop._id
const updloadImageList = appInstance.globalData.updloadImageList

const productDefault = {
  count: 0,
  images: [],
  name: '',
  category: [],
  categoryValue: '',
  cover:'',
  price: ''
}

Page({
  data:{
    product: {}
  },
  onLoad:function(options){
    if (options.id) {
      this.init(options.id)
    } else {
      this.init()
    }
  },
  onShow:function(){
    this.updateFromCache()
  },
  onHide:function(){
    this.saveLocal()
  },
  onUnload:function(){
    userData.set('pre-product', null)
  },
  saveLocal () {
    userData.set('pre-product', this.data.product)
  },
  updateFromCache () {
    if (this.data.locked) return
    let product = userData.get('pre-product') || {}
    this.setData({
      product: product
    })
  },
  init (id) {
    if (id) {
      this.data.locked = true
      Cov({
        url: '/api/product/' + id,
        params: {
          include: 'category'
        }
      })
      .then(res => {
        let valueArr = []
        let product = res.data
        product.category.map(item => {
          valueArr.push(item.name)
        })
        product.categoryValue = valueArr.join(',')    
        valueArr = []
        product.norms.map(item => {
          valueArr.push(item.title)
        })
        product.normsValue = valueArr.join(',')

        this.setData({
          product: product
        })
        userData.set('pre-product', product)
        this.data.locked = false
      })
    } else {
      let product = userData.get('pre-product') || {}
      this.setData({
        product: product
      })
    }
  },
  save () {
    shop = userData.get('shop') || {}
    shopId = shop._id
    const product = this.data.product
    const categoryList = product.category || []
    const category = categoryList.map(item => {
      return item._id
    })
    const id = product._id
    let images = product.images || []

    let uploadImages = []
    
    images.forEach((src, index) => {
      if (src.indexOf('wxfile://') > -1) {
        uploadImages.push(src)
        images.splice(index, 1)
      }
    })

    wx.showToast({
      title: '保存中',
      icon: 'loading',
      duration: 10000
    })

    updloadImageList(uploadImages)
      .then(list => {
        images = images.concat(list)
        let cover = images.length ? images[0] : ''
        return Cov({
          url: '/api/product/' + ( id ? id : ''),
          method: id ? 'patch' : 'post',
          data: {
            name: product.name,
            cover: cover,
            images: images,
            norms: product.norms,
            price: product.price,
            stock: product.stock,
            category: category,
            shop: shopId
          }
        })
      })
      .then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      })
  },
  syncInputValue (e) {
    const key = e.target.dataset.key
    let data = this.data.product
    data[key] = e.detail.value
    this.setData({
        product: data
    })
  },
  navToCategory () {
    wx.navigateTo({
      url: '/page/dash/product-category-select/index'
    })
  },
  navToNorm () {
    wx.navigateTo({
      url: '/page/dash/product-norms/index'
    })
  },
  removeImage (e) {
    const index = e.target.dataset.index
    let product = this.data.product
    product.images.splice(index, 1)
    this.setData({
      product: product
    })
  },
  previewImage (e) {
    const src = e.target.dataset.src
    let product = this.data.product
    wx.previewImage({
      current: src,
      urls: product.images
    })
  },
  chooseImage () {
    this.data.locked = true
    let product = this.data.product || {}
    let images = product.images || []
    wx.chooseImage({
      count: 5 - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:  (res) => {
        var tempFilePaths = res.tempFilePaths
        product.images = images.concat(tempFilePaths)
        this.data.locked = false
        this.setData({
          product: product
        })
        userData.set('pre-product', product)
      },
      fail (err) {
        console.log(err)
      }
    })
  }
})