const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const shopId = appInstance.globalData.shopId

let page = {
  data:{
    statusList: [{
      key: 'open',
      value: '营业中',
      active: false
    }, {
      key: 'closed',
      value: '已休息',
      active: false
    }, {
      key: 'stoped',
      value: '已停业',
      active: false
    }]
  },
  onLoad (options) {
  
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.init()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    this.save()
  },
  init () {
    const shop = userData.get('shop') || {}
    const statusList = this.data.statusList
    if (!shop.status) return

    statusList.forEach(op => {
      console.log(op.key, shop.status, op.key === shop.status)
      if (op.key === shop.status) {
        op.active = true
      }
    })

    this.setData({
      statusList: statusList
    })
  },
  save () {
    let shop = userData.get('shop') || {}

    this.data.statusList.forEach(op => {
      if (op.active) {
        shop.status = op.key
        shop.statusText = op.value
      }
    })
    
    Cov({
      url: '/api/shop/' + shopId,
      method: 'patch',
      data: {
        status: shop.status
      }
    }).then(res => {
      shop = res.data
      userData.set('shop', shop)
    })
  },
  chooseItem (e) {
    const index = e.target.dataset.index
    const statusList = this.data.statusList
    statusList.forEach(op => op.active = false)
    statusList[index].active = true
    this.setData({
      statusList: statusList
    })
  }
}

Page(page)