function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function pad (num) {
  if (num < 10) {
    return '0' + num
  }
  return '' + num
}

function formatDate (date) {
  let time = new Date(date)
  let result = [pad(time.getFullYear()), pad(time.getMonth()+1), pad(time.getDate())].join('-') + ' '
  result += [pad(time.getHours()), pad(time.getMinutes()), pad(time.getSeconds())].join(':')
  return result
}

function formatDateCommon (date) {
    let time = new Date(date)
  let result = [pad(time.getFullYear()), '年',pad(time.getMonth()+1), '月', pad(time.getDate()), '日'].join('')

  return result
}

function CovData (name) {
  this.name = name
}

CovData.prototype.get = function (key) {
  const data = wx.getStorageSync(this.name)
  if (!data) return undefined
  return data[key]
}

CovData.prototype.set = function (key, value) {
  let data = wx.getStorageSync(this.name)
  if (!data) data = {}
  data[key] = value
  wx.setStorageSync(this.name, data)
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  CovData: CovData,
  formatDate: formatDate,
  formatDateCommon: formatDateCommon
}
