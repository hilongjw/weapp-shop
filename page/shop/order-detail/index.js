const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
    order: {
      total: 45.00,
      products: [{
        name: '千树谷红枣夹核桃200克',
        count: 2,
        price: 48.00
      }, {
        name: '千树谷红枣夹核桃200克',
        count: 7,
        price: 7.01
      }, {
        name: '煎饼果子900克',
        count: 1,
        price: 5.00
      }],
      shop: {
        name: '果蔬大卖场综合超市'
      },
      status: '下单成功',
      createdAt: '2015-09-14  01:02:21',
      payType: '货到付款'
    }
  },
  onLoad:function(options){
    this.initOrder('58b2533f7c8b84f3fb9e5e5d')
    if (options.id) {
      this.initOrder(options.id)
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
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
      this.setData({
        order: order
      })
    })
  }
})