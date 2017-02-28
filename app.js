const openIdUrl = require('./config').openIdUrl
const Cov = require('./vendor/cov.js').Cov
const updloadImageList = require('./vendor/cov.js').updloadImageList

App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show', this)
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null,
    dashNav: {
      notify: 0,
      order: 0,
      product: 0,
      shop: 0
    },
    geoHash: 'wx4g0bm3u',
    Cov: Cov,
    shopId: '58b1458132f9f1cc1a695000',
    token: '23234234',
    userId: '58b133a88d9272c5bc359d7f',
    updloadImageList: updloadImageList
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})
