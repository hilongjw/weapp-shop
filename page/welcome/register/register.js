const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
    data: {
        timer: null,
        verify: 0,
        topTip: {
            show: false,
            msg: '错误提示'
        },
        form: {
            vcode: '',
            phone: '',
            name: '',
            area_code: ''
        },
        countries: ["中国(+86)"],
        countryIndex: 0
    },
    onLoad (options) {
      this.data.shopId = options.id
    },
    syncInputValue (e) {
        const key = e.target.dataset.key
        let form = this.data.form
        form[key] = e.detail.value
        this.setData({
            form: form
        })
    },
    checkForm () {
        const formMap =  {
            vcode: '验证码',
            phone: '手机号',
            name: '联系人'
        }
        let allDone = true
        let msg
        Object.keys(formMap).map(key => {
            if (!this.data.form[key]) {
                allDone = false
                msg = formMap[key] + '未填写'
            }
        })
        if (msg) this.showTopTips(msg)
        return allDone
    },
    sendVerify () {
        Cov({
            url: '/api/user/sendsms',
            method: 'post',
            data: {
                phone: this.data.form.phone
            }
        })
        .then(res => {
            wx.showToast({
                title: '发送验证码成功',
                icon: 'success',
                duration: 2000
            })
        })
        .catch(err => {
            clearInterval(this.data.timer)
            this.data.verify = 0
        })
    },
    getVerifyCode () {
        if (!this.data.form.phone) return this.showTopTips('手机号码未填写')
        const phoneReg = /^1[3-9][0-9]{9}$/
        if (!phoneReg.test(this.data.form.phone)) return this.showTopTips('请填写正确的手机号码')

        if (this.data.verify > 1) return

        clearInterval(this.data.timer)
        this.data.verify = 10
        this.data.timer = setInterval(() => {
            console.log(this.data.verify)
            if (this.data.verify < 1) {
                clearInterval(this.data.timer)
            }
            this.setData({
                verify: --this.data.verify
            })
        }, 1000)
        this.sendVerify()
    },
    upToMerchant () {
        Cov({
            url: '/api/user/uptomerchant',
            method: 'post',
            data: {
                phone: this.data.form.phone,
                verify: this.data.form.vcode,
                shop: this.data.shopId
            }
        })
        .then(res => {
            wx.showToast({
                title: '开店成功',
                icon: 'success',
                duration: 2000
            })
             wx.navigateTo({
                url: '/page/welcome/init/init?id=' + this.data.shopId
            })
        })
        .catch(err => {
           if (err.data && err.data.message) {
               this.showTopTips(err.data.message)
           }
        })
    },
    confirm () {
        if (!this.checkForm()) return
        this.upToMerchant()
    },
    showTopTips: function(msg){
        var that = this;
        this.setData({
            topTip: {
                show: true,
                msg: msg
            }
        });
        setTimeout(function(){
            that.setData({
                topTip: {
                    show: false,
                    msg: ''
                }
            });
        }, 3000);
    },
    bindCountryChange: function(e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryIndex: e.detail.value
        })
    }
});