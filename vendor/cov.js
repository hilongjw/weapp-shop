const Promise = require('./promise.js')

const baseUrl = 'http://127.0.0.1:8081'
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
    header = header || {}
    header['authorization'] = '23234234'
    return new Promise((resolve, reject) => {
        wx.request({
          url: baseUrl + url + query,
          data: data,
          method: method || 'get',
          header: header,
          success (res) {
            resolve(res)
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
    header['authorization'] = '23234234'
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

// Cov({
//     url: '',
//     data: {
//         value: 1
//     },
//     params: {
//         id: 233
//     }
// })
// .then(res => {

// })
// .catch(err => {
    
// })

module.exports = {
    Cov: Cov,
    updloadImageList: updloadImageList
}