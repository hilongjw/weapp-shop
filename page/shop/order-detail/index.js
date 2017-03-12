const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const formatDate = require('../../../util/util.js').formatDate

Page({
  data:{
    order: {
      total: 0,
      products: [],
      shop: {
        
      },
      status: '下单成功',
      createdAt: '',
      payType: ''
    }
  },
  onLoad:function(options){
    if (options.id) {
      this.initOrder(options.id)
    } else {
      wx.redirectTo({
        url: '/page/shop/list/list/'
      })
    }
  },
  initOrder (id) {
    Cov({
      url: '/api/order/' + id,
      params: {
        include: 'shop'
      }
    })
    .then(res => {
      let order = res.data
      order.createdAtText = formatDate(order.createdAt)
      this.setData({
        order: order
      })
    })
  },
  cancelOrder () {
    Cov({
      url: '/api/order/' + this.data.order._id,
      method: 'patch',
      data: {
        status: 'cancel'
      }
    })
    .then(res => {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000
        })
        let order = this.data.order
        order.status = 'cancel'
        this.setData({
          order: order
        })
    })
  },
  cancelOrderAction () {
    wx.showModal({
      title: '确认',
      content: '确认要取消订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder()
        }
      }
    })
  },
  callShop () {
    if (!this.data.order.shop || !this.data.order.shop.phone) return
    wx.makePhoneCall({
      phoneNumber: this.data.order.shop.phone
    })
  },
  navToShop () {
    wx.redirectTo({
      url: '/page/shop/lobby/lobby?id=' + this.data.order.shop._id
    })
  }
})