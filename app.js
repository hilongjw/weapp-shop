const openIdUrl = require('./config').openIdUrl
const Cov = require('./vendor/cov.js').Cov
const updloadImageList = require('./vendor/cov.js').updloadImageList

const CovData = require('./util/util.js').CovData

const userData = new CovData('user')

App({
  onLaunch: function () {
    console.log('App Launch', this)
    this.login()
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
  createUser (code, data) {
    Cov({
      url: '/api/user/signup',
      method: 'post',
      data: {
        code: code,
        username: data.nickName,
        gender: data.gender,
        avatar: data.avatarUrl
      }
    })
    .then(res => {
      let data = res.data
      userData.set('user', data)
      this.globalData.token = data.sessionToken
      this.globalData.userId = data._id
    })
  },
  newUser (code) {
    wx.getUserInfo({
      success: (res) => {
        let data

        try {
          data = JSON.parse(res.rawData)
        } catch (e) {
          console.log(e)
        }

        if (data) {
          this.createUser(code, data)
        }
      },
      fail: () => {
        this.login()
      }
    })
  },
  signUp () {
    wx.login({
      success: (wxres) => {
        if (wxres.code) {
          this.newUser(wxres.code)
        }
      }
    })
  },
  login () {
    wx.login({
      fail: (err) => {
        console.log(err)
      },
      success:(wxres) => {
        if (wxres.code) {
          Cov({
              url: '/api/user/login',
              method: 'post',
              data: {
                code: wxres.code
              }
            })
            .then(res => {
              const data = res.data
              userData.set('user', data)
              console.log(this.globalData.token,  data.sessionToken)
              this.globalData.token = data.sessionToken
              console.log(this.globalData.token,  data.sessionToken)
              this.globalData.userId = data._id
            })
            .catch(err => {
              this.newUser(wxres.code)
            })
        }
      }
    })
  }
})
