var util = require("../../utils/util.js");
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var index = options.id;
    var that=this;
    util.topListDetail(index, function (data) {
      var color = data.color.toString(16);
      if(color == 0){
        color ="000";
      }
      that.setData({
        songlist: data.songlist,
        bgColor:color
      })
    })

    //在回调函数里面 setData() 的数据，我们不能在JS里面读取 
    //console.log(that.data.bgColor);
  },
  //打开播放音乐
  openPlaysong:function(ev){
    //console.log(this.data.songlist)
    var index = ev.currentTarget.dataset.idgg;

    //把数据存哪里
    app.globalData.songlist = this.data.songlist[index].data

    //跳转
    wx.navigateTo({
      url: '../playsong/playsong'
    })
  }
})