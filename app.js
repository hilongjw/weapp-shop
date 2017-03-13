const openIdUrl = require('./config').openIdUrl
const Cov = require('./vendor/cov.js').Cov
const updloadImageList = require('./vendor/cov.js').updloadImageList

const CovData = require('./util/util.js').CovData

const userData = new CovData('user')

const user = require('./util/user.js')

App({
    onLaunch: function() {
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
    loadShop(callback) {
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
    login() {
        if (this.globalData.logining) return
        this.globalData.logining = true

        user.login()
            .then(user => {
                this.globalData.logining = false
                userData.set('user', user)
                this.globalData.token = user.sessionToken
                this.globalData.userId = user._id

                if (user.role === 'merchant' && user.shop) {
                    this.loadShop()
                    wx.redirectTo({
                        url: '/page/dash/setting/setting'
                    })
                }
            })
            .catch(err => {
                if (err && err.type === 'wechat' && err.message) {
                    wx.showModal({
                        title: '提示',
                        content: err.message
                    })
                }
            })
    }
})
