const topTip = require('../../common/components/toptip/index.js')
const CovData = require('../../../util/util.js').CovData

const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
console.log('233', appInstance)
const geoHash = require('../../../vendor/geo-hash.js')

let page = {
  data:{
    form: {
      name: '',
      phone: '',
      address: '',
      addressDetail: ''
    }
  },
  onLoad:function(options){
    if (!options.id) return
    this.initFormId(options.id)
  },
  onReady:function(){
    // 页面渲染完成
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
  testLocation () {
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
  initFormId (id) {
    Cov({
      url: '/api/address/' + id
    })
    .then(res => {
      this.setData({
        form: res.data
      })
    })
  },
  save () {
    const id = this.data.form._id
    Cov({
      url: '/api/address/' + (id ? id : ''),
      method: id ? 'patch' : 'post',
      data: {
        name: this.data.form.name,
        phone: this.data.form.phone,
        address: this.data.form.address,
        addressDetail: this.data.form.addressDetail,
        geoHash: this.data.form.geoHash
      }
    })
    .then(res => {
      const list = userData.get('locationList') || []
      list.push(res.data)
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
      wx.navigateBack()
    })
  },
  confirm () {
    const keyNameMap = {
      name: '收货人姓名',
      phone: '联系电话',
      address: '地区',
      addressDetail: '详细地址'
    }
 
    let msg = ''
    Object.keys(keyNameMap).map(key => {
      if (this.data.form[key] === '') {
        msg = keyNameMap[key] + '未填写'
      }
    })
    const phoneReg = /^1[3-9][0-9]{9}$/
    if (!phoneReg.test(this.data.form.phone)) {
      msg = '请填写正确的手机号码'
    }       
    if (msg) return this.showTopTip(msg)
    this.save()
  }
}

topTip(page)

Page(page)