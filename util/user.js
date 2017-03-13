const Promise = require('../vendor/promise.js')

const Cov = require('../vendor/cov.js').Cov
const updloadImageList = require('../vendor/cov.js').updloadImageList

const CovData = require('./util.js').CovData
const userData = new CovData('user')

const ErrorMap = {
    wechat: {
        type: 'wechat',
        message: '获取微信用户信息失败，请尝试重新打开小程序'
    },
    server: {
        type: 'wechat',
        message: '服务器开小差了，请尝试重新打开小程序'
    }
}

function User () {
    this.user = userData.get('user') || {}

    this.createUser = (code, data) => {
        return Cov({
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
                return data
            })
    }

    this.newUser = (code) => {
        return new Promise((resolve, reject) => {
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
                        .then(user => {
                            resolve(user)
                        })
                        .catch(err => {
                            reject(err)
                        })
                    }
                },
                fail: () => {
                    reject(ErrorMap.wechat)
                }
            })
        })
    }

    this.signUp = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (wxres) => {
                    if (wxres.code) {
                        this.newUser(wxres.code)
                            .then(user => {
                                resolve(user)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        reject(ErrorMap.wechat)
                    }
                }
            })
        })
    }

    this.serverLogin = (code) => {
        return new Promise((resolve, reject) => {
            return Cov({
              url: '/api/user/login',
              method: 'post',
              data: {
                code: code
              }
            })
            .then(res => {
                const data = res.data
                userData.set('user', data)
                resolve(data)
            })
            .catch(err => {
                this.signUp()
                    .then(user => {
                        resolve(user)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        })
    } 

    this.login = () => {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (wxres) => {
                    if (wxres.code) {
                        this.serverLogin(wxres.code)
                            .then(user => {
                                resolve(user)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        reject(ErrorMap.wechat)
                    }
                },
                fail: () => {
                    reject(ErrorMap.wechat)
                }
            })
        })
    }
}

const user = new User()

module.exports = user