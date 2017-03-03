const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const updloadImageList = appInstance.globalData.updloadImageList

Page({
  data:{
    shop: {
      logo: 'http://77wdm6.com1.z0.glb.clouddn.com/poster.png',
      name: '纯享有机生活超市',
      address: '',
      addressDetail: '建外SOHO西区12号楼1704',
      status: '营业中',
      dispatchTimeStart: '8:00',
      dispatchTimeEnd: '24:00',
      phone: '13800138000',
      dispatchCost: 0,
      dispatchStart: 0
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
    this.setData({
      shop: shop
    })
  },
  save () {
    const shop = this.data.shop
    userData.set('shop', shop)
  },
  updateImage (img) {
    if (!img) return
    const shop = this.data.shop
    shop.logo = img

    wx.showToast({
      title: '保存中',
      icon: 'loading',
      duration: 10000
    })

    updloadImageList([img])
      .then(imglist => {
        let logo = imglist[0]
        const shop = userData.get('shop') || {}
        return Cov({
          url: '/api/shop/' + shop._id,
          method: 'patch',
          data: {
            logo: logo
          }
        })
      })
      .then(res => {
        this.setData({
          shop: shop
        })
        wx.hideToast()
      })
  },
  getImageFromCamera () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        console.log(res)
        this.updateImage(tempFilePaths[0])
      }
    })
  },
  getImageFromAlbum () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        console.log(res)
        this.updateImage(tempFilePaths[0])
      }
    })
  }
})