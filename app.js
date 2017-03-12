const openIdUrl = require('./config').openIdUrl
const Cov = require('./vendor/cov.js').Cov
const updloadImageList = require('./vendor/cov.js').updloadImageList

const CovData = require('./util/util.js').CovData

const userData = new CovData('user')

App({
  onLaunch: function () {
    this.login()
  },
  globalData: {
    logining: false,
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
    updloadImageList: updloadImageList
  },
  loadShop (callback) {
    const user = userData.get('user') || {}
    const userId = user._id

    if (!userId) {
      return this.login()
    }

    const shopId = user.shop

    if (!shopId) return 

    Cov({
      url: '/api/shop/' + shopId
    })
    .then(res => {
      userData.set('shop', res.data)
      callback && callback()
    })

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
    if (this.globalData.logining) return
    this.globalData.logining = true
    wx.login({
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
              this.globalData.logining = false
              const data = res.data
              userData.set('user', data)
              this.globalData.token = data.sessionToken
              this.globalData.userId = data._id
              if (data.role === 'merchant' && data.shop) {
                this.loadShop()
                wx.redirectTo({
                  url: '/page/dash/setting/setting'
                })
              }
            })
            .catch(err => {
              this.signUp()
            })
        }
      }
    })
  }
})
