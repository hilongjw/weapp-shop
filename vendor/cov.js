const Promise = require('./promise.js')
const config = require('../config.js')
const CovData = require('../util/util.js').CovData
const baseUrl = config.host

let userData = new CovData('user')
let user = userData.get('user') || {}

function paramsToQuery (params) {
    if (!params) return ''
    let query = ''
    let paramsArr = []
    Object.keys(params).forEach(key => {
        if (typeof params[key] !== 'undefined') {
            paramsArr.push([key, params[key]].join('='))
        }
    })
    if (!paramsArr.length) return
    query = paramsArr.join('&')
    return '?' + query
}

function Cov ({ url, data, params, header, method }) {
    let query = paramsToQuery(params)
    user = userData.get('user') || {}
    header = header || {}
    header['authorization'] = user.sessionToken
    return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + url + query,
          data: data,
          method: method || 'get',
          header: header,
          success (res) {
              if (res.statusCode > 299) {
                reject(res)
              } else {
                resolve(res)
              }
          },
          fail (err) {
            reject(err)
          }
        })
    })
}

function uploadImage ({ url, src, header }) {
    return new Promise((resolve, reject) => {
         wx.uploadFile({
          url: url,
          header: header,
          filePath: src,
          name: 'file',
          success: (res) => {
            let data = res.data
            try {
                data = JSON.parse(data)
            } catch (e) {
                console.log(e)
            }
            res.data = data
            resolve(data.key)
          },
          fail (err) {
              console.log(err)
            reject(err)
          }
        })
    })
}

function updloadImageList (imgs) {
    const url = '/api/file/'
    let header = {}
    user = userData.get('user')
    header['authorization'] = user.sessionToken
    let queue = []
    let up = Promise.resolve()
    imgs.forEach(src => {
        up = up.then((link) => {
            if (link) queue.push(link)
            return uploadImage({
                url: baseUrl + url,
                header: header,
                src: src
            })
        })
    })
    return up.then(link => {
        if (link) queue.push(link)
        return queue
    })
}

module.exports = {
    Cov: Cov,
    updloadImageList: updloadImageList
}