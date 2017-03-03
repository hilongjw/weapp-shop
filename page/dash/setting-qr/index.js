const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')
const shop = userData.get('shop') || {}
const config = require('../../../config.js')
const host = config.host
const qrUrl = '/api/qr/path?path=/page/shop/lobby/lobby?id='

Page({
  data:{
    qrImage: host + qrUrl + shop._id
  },
  onLoad (options) {
 
  },
  onReady:function(){
    
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
  previewImg (e) {
    const img = this.data.qrImage
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
})