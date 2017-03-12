const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const config = require('../../../config.js')
const host = config.host
const qrUrl = '/page/shop/lobby/lobby?id='

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
    qrImage: ''
  },
  onLoad (options) {
    this.init()
  },
  init () {
    const shop = userData.get('shop') || {}
    const shopId = shop._id
    Cov({
      url: '/api/qr/path',
      params: {
        path: qrUrl + shopId
      }
    })
    .then(res => {
      let link = res.data.link
      this.setData({
        qrImage: link
      })
    })
  },
  previewImg (e) {
    const img = this.data.qrImage
    console.log(img)
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
})