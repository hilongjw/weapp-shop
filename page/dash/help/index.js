var WxParse = require('../../../vendor/wxParse/wxParse.js')
const appInstance = getApp()
const Cov = appInstance.globalData.Cov

Page({
  data:{
  },
  onLoad:function(options){
    this.loadHelp()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  createArticle () {
    Cov({
      url: '/api/article',
      method: 'post',
      data: {
        title: '帮助',
        content: article
      }
    })
    .then(res => {
      console.log(res)
    })
  },
  loadHelp () {
    Cov({
      url: '/api/article',
      params: {
        title: '帮助'
      }
    })
    .then(res => {
      let articles = res.data
      if (!articles.length) return
      wx.setNavigationBarTitle({
        title: articles[0].title
      })
      this.data.page = articles[0]
      WxParse.wxParse('article', 'md', this.data.page.content, this, 5)
    })
  }
})