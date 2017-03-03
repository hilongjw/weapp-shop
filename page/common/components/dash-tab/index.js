let tabbar = [{
    active: true,
    key: 'notify',
    icon: 'http://77wdm6.com1.z0.glb.clouddn.com/notify.svg',
    iconActive: 'http://77wdm6.com1.z0.glb.clouddn.com/notify_active.svg',
    text: '待处理',
    badge: 0,
    url: '/page/dash/order-new/index'
}, {
    active: false,
    key: 'order',
    icon: 'http://77wdm6.com1.z0.glb.clouddn.com/order.svg',
    iconActive: 'http://77wdm6.com1.z0.glb.clouddn.com/order_active.svg',
    text: '订单',
    badge: 0,
    url: '/page/dash/order/index'
}, {
    active: false,
    key: 'product',
    icon: 'http://77wdm6.com1.z0.glb.clouddn.com/product.svg',
    iconActive: 'http://77wdm6.com1.z0.glb.clouddn.com/product_active.svg',
    text: '商品',
    badge: 0,
    url: '/page/dash/product/index'
}, {
    active: false,
    key: 'shop',
    icon: 'http://77wdm6.com1.z0.glb.clouddn.com/shop_gray.svg',
    iconActive: 'http://77wdm6.com1.z0.glb.clouddn.com/shop_light.svg',
    text: '店铺',
    badge: 0,
    url: '/page/dash/setting/setting'
}]

const Promise = require('../../../../vendor/promise.js')
const CovData = require('../../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov
let dashNav = appInstance.globalData.dashNav
let shop = userData.get('shop') || {}
let shopId = shop._id

const keyCount = {
    notify: {
        url: '/api/order/count',
        params: {
            shop: shopId,
            status: 'wait'
        }
    },
    order: {
        url: '/api/order/count',
        params: {
            shop: shopId,
            status: 'sending'
        }
    }
}

function updateShopId () {
    shop = userData.get('shop') || {}
    shopId = shop._id
    Object.keys(keyCount).map(key => {
        keyCount[key].params.shop = shopId
    })
}

function updateAllCount () {
    let queue = []
    updateShopId()
    Object.keys(keyCount).forEach(key => {
        queue.push(updateTabCount(key))
    })
    return Promise.all(queue)
}

function updateTabCount (key) {
    if (!keyCount[key] || !keyCount[key].params.shop ) {
        appInstance.loadShop()
        return Promise.resolve()
    }
    return Cov(keyCount[key])
    .then(res => {
        let count = res.data.count
        return {   
            key: key,
            count: count
        }
    })
}

module.exports = function (app) {
    app.data.dashTab =  tabbar

    app.setTabBarActive = function (key) {
        const dashTab = this.data.dashTab
        dashTab.forEach(item => {
            item.active = key === item.key
            item.badge = 0
        })

        this.updateAllCount()
        
        this.setData({
            dashTab: dashTab
        })
    }

    app.updateAllCount = function () {
        updateAllCount()
            .then(results => {
                results.forEach(item => {
                    if (item) {
                        this.setTabBarBadge(item.key, item.count)
                    }
                })
            })
    }

    app.setTabBarBadge = function (key, count) {
        const dashTab = this.data.dashTab
        dashTab.forEach(item => {
            if (item.key === key) {
                item.badge = count || 0
            }
        })
        this.setData({
            dashTab: this.data.dashTab
        })
    }

    app.touchTabBar =  function (e) {
        const index = e.currentTarget.dataset.index
        this.data.dashTab.forEach(item => item.active = false)
        this.data.dashTab[index].active = true

        wx.redirectTo({
            url: this.data.dashTab[index].url
        })

        this.setData({
            dashTab: this.data.dashTab
        })
    }
}