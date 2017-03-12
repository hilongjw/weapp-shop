const dashTab = require('../../common/components/dash-tab/index.js')

const appInstance = getApp()
const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')
const Cov = appInstance.globalData.Cov
const shop = userData.get('shop') || {}
const shopId = shop._id
const formatDate = require('../../../util/util.js').formatDate

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
      status: 'sending',
      include: 'address'
    },
    topTabNav: [{
        key: 'sending',
        text: '新订单',
        active: true
    }, {
        key: 'done',
        text: '已完成',
        active: false
    }, {
        key: 'cancel',
        text: '已取消',
        active: false
    }],
    orderList: []
  },
  onPullDownRefresh: function(){
    this.loadOrder()
  },
  onShow:function(){
    this.setTabBarActive('order')
    this.loadOrder()
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
        return this.data.status.ended = true
      }
      let list = res.data
      list = list.map(od => {
        od.createdAtText = formatDate(od.createdAt)
        return od
      })

      if (add) {
        let orderList = this.data.orderList
        orderList = orderList.concat(list)
        this.setData({
          orderList: orderList
        })
      } else {
        this.setData({
          orderList: list
        })
      }
    })
  },
  loadMore () {
    this.data.params.skip += this.data.params.limit
    this.loadOrder(true)
  },
  tapTopTabNav (e) {
      const index = e.currentTarget.dataset.index
      const topTabNav = this.data.topTabNav
      topTabNav.forEach(tab => tab.active = false)
      topTabNav[index].active = true
      this.setData({
          viewShow: topTabNav[index].key,
          topTabNav: topTabNav
      })
      this.data.params.status = topTabNav[index].key  
      this.data.params.skip = 0
      this.data.status.ended = false
      this.loadOrder()
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