const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let userId = appInstance.globalData.userId

Page({
  data:{
    form: {
      dispatchTime: '',
      remark: '',
      location: {
        _id: '',
        address: '',
        addressDetail: '',
        phone: ''
      },
      total: 0
    },
    productList: []
  },
  onLoad:function(options){
    this.data.shopId = options.id
    userId = appInstance.globalData.userId
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    let locationList = userData.get('locationList') || []
    const currentLocation = userData.get('currentLocation')
    this.initCartList()
    if (!locationList.length || !currentLocation) {
      let form = this.data.form
      form.location.address = '请选择配送地址'
      return this.setData({
          form: form,
      })
    }

    let form = this.data.form
    form.location = currentLocation
    return this.setData({
        form: form
    })
  },
  initCartList () {
      const cartList = userData.get('cartList') || []    
      const shop = userData.get('shop') || {}
      const form = this.data.form
      let total = shop.dispatchCost || 0

      cartList.forEach(item => {
        total += item.price * item.count
      })

      form.total = total.toFixed(2)

      this.setData({
          form: form,
          productList: cartList,
      })
  },
  syncInputValue (e) {
    const key = e.target.dataset.key
    let form = this.data.form
    form[key] = e.detail.value
    this.setData({
        form: form
    })
    console.log(form)
  },
  bindPickerChange (e) {
    const value = e.detail.value
    let form = this.data.form
    form['dispatchTime'] = value
    this.setData({
      form: form
    })
  },
  navToLocation (e) {
    wx.navigateTo({
        url: '/page/shop/user-location/index'
    })
  },
  createOrder (formId) {
    const detail = this.data.productList
 
    Cov({
      url: '/api/order',
      method: 'post',
      data: {
        address: this.data.form.location._id,
        mark: this.data.form.remark,
        dispatchAt: this.data.form.dispatchTime,
        detail: detail,
        shop: this.data.shopId,
        formId: formId
      }
    })
    .then(res => {
      let order = res.data
      wx.redirectTo({
        url: '/page/shop/order-state/index?id=' + order._id 
      })
    })
  },
  submitOrder (e) {
    let formId = e.detail.formId
    if (!this.data.form.location._id) {
      return wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请选择配送地址'
      })
    }
    let data = this.data.form
    data.productList = this.data.productList
    this.createOrder(formId)
  }
})