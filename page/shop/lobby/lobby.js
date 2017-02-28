const data = require('./data.js')
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
        shop: {
            id: 1,
            cover: 'http://77wdm6.com1.z0.glb.clouddn.com/poster.png',
            name: '纯享有机生活超市',
            phone: '13800138000',
            address: '朝阳区通惠家园惠润园6号楼108',
            dispatchCost: 0,
            dispatchStart: 0,
            dispatchType: '商家配送',
            dispatchTime: '8:00 - 23:00'
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
        categoryList: [],
        productList: []
    },
    init (shopId) {
        wx.showToast({
            icon: 'loading'
        })
        this.initCategory(shopId)
        this.initProduct(shopId)
        this.initShop(shopId)
    },
    initShop (id) {
        Cov({
            url: '/api/shop/' + id
        })
        .then(res => {
            this.setData({
                shop: res.data
            })
        })
    },
    initProduct (id, category) {
        Cov({
            url: '/api/product/',
            params: {
                shop: id,
                category: category
            }
        })
        .then(res => {
            wx.hideToast()
            this.setData({
                productList: res.data
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
            this.setData({
                categoryList: res.data
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
        this.initProduct(this.data.shopId, list[index]._id)
        this.setData({
            categoryList: list
        })
    },
    getProductById (e) {
        console.log(e)
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
    getCartByIndex (id) {

    },
    addProductCount (e) {
        const product = this.getProductById(e)
        if (!product.count) product.count = 0
        product.count++
        this.updateProductCount()
    },
    reduceProductCount (e) {
        const product = this.getProductById(e)
        if (!product.count) product.count = 1
        product.count--
        if (product.count < 0) product.count = 0
        this.updateProductCount()
    },
    productDetail (e) {
        const product = this.getProductById(e)
        console.log(product)
        this.setData({
            popMask: true,
            productPop: {
                show: true,
                id: product.id,
                name: product.name,
                cover: product.cover,
                price: product.price
            }
        })
    },
    updateProductCount () {
        const productList = this.data.productList
        let cartPrice = 0
        let cartCount = 0
        const cartList = productList.filter(product => {
            if (product.count) {
                cartCount += product.count
                cartPrice += product.count * product.price
            }
            return product.count
        })
        cartPrice = cartPrice.toFixed(2)
        this.setData({
            cartCount: cartCount,
            cartPrice: cartPrice,
            cartList: cartList,
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
        console.log(e)
        console.log(this.data.popCart)
        const show = !this.data.popCart
        this.setData({
            popMask: show,
            popCart: show
        })
    },
    showProductNorms (e) {
        const product = this.getProductById(e)
        this.setData({
            popMask: true,
            productNormsPop: {
                show: true,
                total: product.price,
                _id: product._id,
                name: product.name,
                cover: product.cover,
                price: product.price,
                count: product.count,
                norms: product.norms,
            }
        })
    },
    tapNormTag (e) {
        const nIndex = e.target.dataset.nindex
        const tIndex = e.target.dataset.tindex

        const productNormsPop = this.data.productNormsPop

        const tag = productNormsPop.norms[nIndex].options[tIndex]
        productNormsPop.norms[nIndex].options.forEach(tag => tag.active = false)
        tag.active = true

        this.setData({
            productNormsPop: productNormsPop
        })
    },
    addNormCount (e) {
        const productNormsPop = this.data.productNormsPop
        if (!productNormsPop.count)productNormsPop.count = 0
        productNormsPop.count++
        productNormsPop.total = productNormsPop.price * productNormsPop.count
        productNormsPop.total = productNormsPop.total.toFixed(2)
        this.setData({
            productNormsPop: productNormsPop
        })
        console.log(productNormsPop)
        this.addProductCount(e)
    },
    reduceNormCount (e) {
        const productNormsPop = this.data.productNormsPop
        productNormsPop.count--
        if (productNormsPop.count > -1) {
            productNormsPop.total = productNormsPop.price * productNormsPop.count
            productNormsPop.total = productNormsPop.total.toFixed(2)
        }
        this.setData({
            productNormsPop: productNormsPop
        })
        this.reduceProductCount(e)
    },
    navToPreOrder () {
        userData.set('cartList', this.data.cartList)

        console.log(this.data.cartList)

        wx.navigateTo({
            url:'/page/shop/pre-order/index',
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
})