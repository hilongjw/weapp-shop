module.exports = function (app) {
    app.data['topTip'] =  {
        show: false,
        msg: ''
    }

    app.showTopTip =  function (msg) {
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
    }
}