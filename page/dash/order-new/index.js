const dashTab = require('../../common/components/dash-tab/index.js')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let app = {
  data:{
    status: {
      loading: false,
      ended: false
    },
    params: {
      shop: shopId,
      limit: 5,
      skip: 0,
      status: 'wait',
      include: 'address'
    },
    orderList: []
  },
  onPullDownRefresh: function(){
    this.loadOrder()
  },
  onLoad:function(options){
    // this.loadOrder('wait')
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.setTabBarActive('notify')
    this.loadOrder()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  loadOrder (add) {
    if (this.data.status.loading || this.data.status.ended) return
    this.data.status.loading = true
    Cov({
      url: '/api/order',
      params: this.data.params,
    })
    .then(res => {
      wx.stopPullDownRefresh()
      this.data.status.loading = false
      if (!res.data || !res.data.length) {
        this.data.status.ended = true
      }
      if (add) {
        let orderList = this.data.orderList
        orderList = orderList.concat(res.data)
        this.setData({
          orderList: orderList
        })
      } else {
        this.setData({
          orderList: res.data
        })
      }
    })
  },
  loadMore () {
    this.data.params.skip += this.data.params.limit
    this.loadOrder(true)
  },
  navToDetail (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/dash/order-detail/index?id=' + id
    })
  }
}

dashTab(app)
Page(app)