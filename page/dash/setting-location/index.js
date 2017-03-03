const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')
const geoHash = require('../../../vendor/geo-hash.js')
const appInstance = getApp()
const Cov = appInstance.globalData.Cov

let page = {
  data:{
    form: {
      postCode: '',
      address: '',
      addressDetail: ''
    }
  },
  onLoad:function(options){
    
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
    
  },
  init () {
    const shop = userData.get('shop') || {}
    let form = {
      postCode: shop.postCode || '',
      address: shop.address || '',
      addressDetail: shop.addressDetail ||''
    }

    this.setData({
      form: form,
      shop: shop
    })
  },
  save () {
    const shop = this.data.shop
    const form = this.data.form

    Object.keys(form).map(key => {
      shop[key] = form[key]
    })

    userData.set('shop', shop)

    Cov({
      url: '/api/shop/' + shop._id,
      method: 'patch',
      data: {
        geoHash: form.geoHash,
        postCode: form.postCode,
        address: form.address,
        addressDetail: form.addressDetail,
      }
    })
    .then(res => {
      wx.navigateBack()
    })
  },
  chooseLocation () {
    wx.chooseLocation({
      success: (res) => {
        const hash = geoHash.encode(res.latitude, res.longitude)
        console.log(hash)
        let form = this.data.form
        form.latitude = res.latitude
        form.longitude = res.longitude
        form.geoHash = hash
        form['address'] = res.address + res.name

        let shop = userData.get('shop') || {}

        shop.geoHash = form.geoHash
        shop.addressDetail = form.addressDetail
        shop.address = form.address

        userData.set('shop', shop)

        this.setData({
            form: form
        })
        console.log(res)
      },
      fail (err) {
        console.log(err)
      },
      cancel (err) {
        console.log(err)
      }
    })
  },
  syncInputValue (e) {
    const key = e.target.dataset.key
    let form = this.data.form
    form[key] = e.detail.value
    this.setData({
        form: form
    })
  },
  initFormId (index) {
    const locationList = userData.get('locationList')
    if (locationList && locationList[index]) {
      this.data.form = locationList[index]
      this.data.index = index
      this.setData({
        form: this.data.form
      })
    }
  }
}

topTip(page)

Page(page)