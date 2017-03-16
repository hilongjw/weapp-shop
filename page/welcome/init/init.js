const geoHash = require('../../../vendor/geo-hash.js')
const topTip = require('../../common/components/toptip/index.js')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
const updloadImageList = appInstance.globalData.updloadImageList

let app = {
  data:{
    form: {
      name: '',
      address: '',
      addressDetail: '',
      scope: '',
      geoHash: '',
      license: []
    },
    images: []
  },
  onLoad:function(options){
    this.data.shopId = options.id
  },
  syncInputValue (e) {
      const key = e.target.dataset.key
      let form = this.data.form
      form[key] = e.detail.value
      this.setData({
          form: form
      })
      console.log(form)
  },
  navToVerify () {
    wx.redirectTo({
        url: '/page/welcome/verify/verify'
    })
  },
  getLocation () {
    wx.chooseLocation({
      success: (res) => {
        let form = this.data.form
        const hash = geoHash.encode(res.latitude, res.longitude)
        form.latitude = res.latitude
        form.longitude = res.longitude
        form.geoHash = hash
        form['address'] = res.address + res.name
        this.setData({
            form: form
        })
      }
    })
  },
  removeImage (e) {
    const index = e.target.dataset.index
    let images = this.data.images
    images.splice(index, 1)
    this.setData({
      images: images
    })
  },
  previewImage (e) {
    const src = e.target.dataset.src
    wx.previewImage({
      current: src,
      urls: this.data.images
    })
  },
  chooseImage () {
    let product = this.data.product
    let images = this.data.images || []
    wx.chooseImage({
      count: 5 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:  (res) => {
        var tempFilePaths = res.tempFilePaths
        images = images.concat(tempFilePaths)

        this.setData({
          images: images
        })
      }
    })
  },
  checkForm () {
    const formMap = {
      name: '商店名称',
      address: '地址',
      addressDetail: '详细地址',
      scope: '经营范围'
    }

    let allDone = true
    let msg
    Object.keys(formMap).map(key => {
        if (!this.data.form[key]) {
            allDone = false
            msg = formMap[key] + '未填写'
        }
    })
    if (!this.data.images.length) {
      allDone = false
      msg = '营业执照未上传'
    }
    if (msg) this.showTopTip(msg)
    return allDone
  },
  save () {
    if (!this.checkForm()) return
    wx.showToast({
      title: '请求发送中',
      icon: 'loading',
      duration: 3000
  })
    updloadImageList(this.data.images)
      .then(list => {
        this.data.form.license = list
        return Cov({
          url: '/api/shop/' + this.data.shopId,
          method: 'patch',
          data: this.data.form
        })
      })
      .then(res => {
        wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
        })
        this.navToVerify()
      })
  }
}
topTip(app)
Page(app)