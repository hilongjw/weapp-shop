const CovData = require('../../../util/util.js').CovData
const userData = new CovData('user')

const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
    onLoad (options) {
        this.data.shopId = options.id
        this.init(this.data.shopId)
    },
    data: {
        viewShow: 'product',
        productLoading: false,
        shop: {
            cover: '',
            name: '',
            phone: '',
            address: '',
            dispatchCost: 0,
            dispatchStart: 0,
            dispatchType: '商家配送'
        },
        topTabNav: [{
            key: 'product',
            text: '商品',
            active: true
        }, {
            key: 'shop',
            text: '商家',
            active: false
        }],
        productParams: {
            skip: 0,
            limit: 6,
            shop: '',
            category: undefined
        },
        popMask: false,
        popCart: false,
        productNormsPop: {
            show: false,
            index: 0,
            name: '',
            cover: '',
            price: '',
            norms: [],
        },
        productPop: {
            show: false,
            index: 0,
            name: '',
            cover: '',
            price: ''
        },
        cartCount: 0,
        cartPrice: 0,
        cartList: [],
        cartQueue: [],
        categoryList: [],
        productList: []
    },
    onShareAppMessage: function () {
        return {
            title: this.data.shop.name + ' - 这个店',
            path: '/page/shop/lobby/lobby?id=' + this.data.shop._id
        }
    },
    callShop () {
        if (!this.data.shop || !this.data.shop.phone) return
        wx.makePhoneCall({
            phoneNumber: this.data.shop.phone
        })
    },
    init (shopId) {
        wx.showToast({
            icon: 'loading'
        })
        this.initCategory(shopId)
        this.data.productParams.shop = shopId
        this.initShop(shopId)
        this.loadMoreProduct()
    },
    navToWelcome (id) {
        wx.redirectTo({
          url: '/page/welcome/index/index?id=' + id
        })
    },
    initShop (id) {
        Cov({
            url: '/api/shop/' + id
        })
        .then(res => {
            let shop = res.data

            if (!shop.user) {
                return this.navToWelcome(shop._id)
            }

            userData.set('shop', shop)

            this.setData({
                shop: shop
            })
            wx.setNavigationBarTitle({
                title: shop.name
            })
        })
    },
    loadMoreProduct () {
        this.setData({
            productLoading: true
        })
        Cov({
            url: '/api/product/',
            params: this.data.productParams
        })
        .then(res => {
            wx.hideToast()
            this.setData({
                productLoading: false
            })
            let productList = this.data.productList
            productList = productList.concat(res.data)  
            this.data.productParams.skip += 10
            this.setData({
                productList: productList
            })
        })
    },
    initCategory (id) {
        Cov({
            url: '/api/category/',
            params: {
                shop: id
            }
        })
        .then(res => {
            let list = [{
                name: '全部',
                active: true
            }]
            list = list.concat(res.data)
            this.setData({
                categoryList: list
            })
        })
    },
    tapTopTabNav (e) {
        const index = e.target.dataset.index
        const topTabNav = this.data.topTabNav
        topTabNav.forEach(tab => tab.active = false)
        topTabNav[index].active = true
        this.setData({
            viewShow: topTabNav[index].key,
            topTabNav: topTabNav
        })
    },
    tapCategory (e) {
        const index = e.target.dataset.index
        let list = this.data.categoryList
        for (let i = 0, len = list.length; i < len;i++) {
            list[i].active = false
        }
        list[index].active = true

        this.data.productParams.shop = this.data.shopId
        this.data.productParams.category = list[index]._id
        this.data.productParams.skip = 0
        this.data.productList = []
        this.loadMoreProduct()
        this.setData({
            categoryList: list
        })
    },
    getProductById (e) {
        const id = e.target.dataset.id
        const productList = this.data.productList
        let product
        for (let i = 0, len = productList.length; i < len; i++) {
            if (productList[i]._id === id) {
                product = productList[i]
            }
        }
        return product
    },
    addProductCount (e) {
        if (this.data.shop.status !== 'open') return
        const product = this.getProductById(e)
        if (!product.count) product.count = 0
        product.count++
        this.addProduct(product)
    },
    reduceProductCount (e) {
        const product = this.getProductById(e)
        if (!product.count) product.count = 1
        product.count--
        if (product.count < 0) product.count = 0
        this.reduceProduct(product)
    },
    productDetail (e) {
        const product = this.getProductById(e)
        this.setData({
            popMask: true,
            productPop: {
                show: true,
                product: product
            }
        })
    },
    addProduct (product) {
        const cartQueue = this.data.cartQueue
        cartQueue.push(product)

        this.updateProductCount()
    },
    reduceProduct (product) {
        const cartQueue = this.data.cartQueue

        for (let i = cartQueue.length - 1 ; i > -1; i--) {
            if (cartQueue[i]._id === product._id) {
                cartQueue.splice(i, 1)
                break
            }
        }
        this.updateProductCount()
    },
    getCartQueue () {
        let product
        let idMap = {}
        let list = []
        let tmp
        let cartQueue = this.data.cartQueue
        let count = cartQueue.length
        let price = 0

        cartQueue.map(pd => {
            price += pd.price
            if (idMap[pd._id]) {
                tmp = list.find(cart => cart._id === pd._id)
                tmp.count++
            } else {
                idMap[pd._id] = 1
                list.push({
                    _id: pd._id,
                    name: pd.name,
                    count: 1,
                    price: pd.price
                })
            }
        })

        return {
            total: price.toFixed(2),
            count: count,
            cartList: list
        }
    },
    updateProductCount () {
        const cart = this.getCartQueue()
        const productList = this.data.productList

        this.setData({
            cartCount: cart.count,
            cartPrice: cart.total,
            cartList: cart.cartList,
            productList: productList
        })
    },
    addProductToCart (e) {
        const product = this.getProductById(e)
        if (product.count) {
            return this.setData({
                popMask: false,
                productPop: {
                    show: false,
                    name: '',
                    cover: '',
                    price: ''
                }
            })
        }

        product.count = 1
        this.setData({
            popMask: false,
            productPop: {
                show: false,
                name: '',
                cover: '',
                price: ''
            }
        })
        this.updateProductCount()
    },
    tapMask () {
        this.setData({
            popMask: false,
            popCart: false,
            productNormsPop: {
                show: false
            },
            productPop: {
                show: false
            }
        })
    },
    toggleCartList (e) {
        const show = !this.data.popCart
        this.setData({
            popMask: show,
            popCart: show
        })
    },
    showProductNorms (e) {
        if (this.data.shop.status !== 'open') return
        const product = this.getProductById(e)

        this.setData({
            popMask: true,
            productNormsPop: {
                show: true,
                total: product.price,
                product: product
            }
        })
    },
    tapNormTag (e) {
        const nIndex = e.target.dataset.nindex
        const tIndex = e.target.dataset.tindex

        const productNormsPop = this.data.productNormsPop

        const tag = productNormsPop.product.norms[nIndex].options[tIndex]
        productNormsPop.product.norms[nIndex].options.forEach(tag => tag.active = false)
        tag.active = true

        this.setData({
            productNormsPop: productNormsPop
        })
    },
    productNormFormat (product) {
        let normsText = ''

        product.norms.map(n => {
            n.options.map(op => {
                if (op.active) {
                    normsText += n.title + ': ' + op.text + ' '
                    // norms.push({
                    //     title: n.title,
                    //     value: op.text
                    // })
                }
            })
        })

        return normsText

    },
    addNormCount (e) {
        const productNormsPop = this.data.productNormsPop
        if (!productNormsPop.product.count)productNormsPop.product.count = 0
        productNormsPop.product.count++
        productNormsPop.total = productNormsPop.product.price * productNormsPop.product.count
        productNormsPop.total = productNormsPop.total.toFixed(2)
        this.setData({
            productNormsPop: productNormsPop
        })
        const product = this.getProductById(e)
        if (!product.count) product.count = 0
        product.count++

        // console.log(productNormsPop.product)
        productNormsPop.product.normsText = this.productNormFormat(productNormsPop.product)
        this.addProduct(productNormsPop.product)
    },
    reduceNormCount (e) {
        const productNormsPop = this.data.productNormsPop
        productNormsPop.product.count--
        if (productNormsPop.product.count > -1) {
            productNormsPop.total = productNormsPop.product.price * productNormsPop.product.count
            productNormsPop.total = productNormsPop.total.toFixed(2)
        }
        this.setData({
            productNormsPop: productNormsPop
        })
        const product = this.getProductById(e)
        if (!product.count) product.count = 1
        product.count--
        if (product.count < 0) product.count = 0
        this.reduceProduct(productNormsPop.product)
    },
    navToPreOrder () {
        const cartPrice = this.data.cartPrice
        const shop = userData.get('shop')
        const dispatchStartPrice = shop.dispatchStartPrice || 0

        if (Number(cartPrice) < dispatchStartPrice) {
            return wx.showModal({
                title: '提示',
                showCancel: false,
                content: '没有到商家的起送金额'
            })
        }
        if (this.data.cartPrice)
        userData.set('shopCart', {
            cartList: this.data.cartList,
            cartQueue: this.data.cartQueue,
        })
        wx.navigateTo({
            url:'/page/shop/pre-order/index?id=' + this.data.shop._id
        })
    }
})