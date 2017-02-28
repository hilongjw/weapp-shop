const QR = require("../../../util/qrcode.js")
const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

Page({
  data:{
    maskHidden:true,
    imagePath:'',
    placeholder:'baidu.com'
  },
  onLoad (options) {
    const shop = userData.get('shop') || {}
    const size = this.setCanvasSize()
    const initUrl = shop.logo
    this.createQrCode(initUrl, 'mycanvas', size.w,size.h)
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
  setCanvasSize () {
    var size = {
      w: 750,
      h: 750
    }
    try {
        const res = wx.getSystemInfoSync();
        console.log(res)
        const scale = res.pixelRatio
        const width = res.windowWidth
        size = {
          w: width,
          h: width
        }
      } catch (e) {
        console.log("获取设备信息失败" + e)
      } 
    return size
  },
  createQrCode (url, canvasId, cavW, cavH) {
    QR.qrApi.draw(url, canvasId, cavW, cavH)
    const timer = setTimeout(() => {
      this.canvasToTempImage()
      clearTimeout(timer)
    },3000)
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage () {
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: (res) => {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          this.setData({
              imagePath:tempFilePath,
          });
      },
      fail: function (res) {
          console.log(res)
      }
    })
  },
  //点击图片进行预览，长按保存分享图片
  previewImg (e) {
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit (e) {
    const url = e.detail.value.url
    console.log(url)
    this.setData({
      maskHidden:false,
    })

    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration:2000
    })

    let timer = setTimeout(() => {
      wx.hideToast()
      const size = this.setCanvasSize()
      this.createQrCode(url, "mycanvas", size.w, size.h)
      this.setData({
        maskHidden:true
      })
      clearTimeout(timer)
    }, 2000)
  }
})