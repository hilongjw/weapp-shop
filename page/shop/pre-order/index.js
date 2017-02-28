const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId
const userId = appInstance.globalData.userId

Page({
  data:{
    form: {
      dispatchTime: 0,
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
    // 页面初始化 options为页面跳转所带来的参数
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
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  initCartList () {
      const cartList = userData.get('cartList') || []
      const form = this.data.form
      let total = 0

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
        url: '/page/shop/user-location/index', 
        success: function(res){
            console.log(res)
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }
    })
  },
  createOrder () {
    const detail = this.data.productList
 
    Cov({
      url: '/api/order',
      method: 'post',
      data: {
        address: this.data.form.location._id,
        mark: this.data.form.remark,
        dispatchAt: this.data.form.dispatchTime,
        detail: detail,
        shop: shopId
      }
    })
    .then(res => {
      let order = res.data
      wx.redirectTo({
        url: '/page/shop/order-state/index?id=' + order._id 
      })
    })
  },
  submitOrder () {
    if (!this.data.form.location._id) {
      console.log('miss location')
    }
    let data = this.data.form
    data.productList = this.data.productList
    console.log(data)
    this.createOrder()
  }
})