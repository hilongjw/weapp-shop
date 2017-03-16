const geoHash = require('../../../vendor/geo-hash.js')

Page({
  data: {
    markers: [{
      iconPath: "/image/location.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 22
    }]
  },
  onLoad (options) {
      this.init(options.hash)
  },
  init (hash) {
    if (hash == 'undefined') return
    const pos = geoHash.decode(hash)
    console.log(pos)
    this.setData({
      latitude: pos.latitude,
      longitude: pos.longitude,
      markers: [{
        iconPath: "/image/location.png",
        id: 0,
        latitude: pos.latitude,
        longitude: pos.longitude,
        width: 20,
        height: 22
      }]
    })
  }
})