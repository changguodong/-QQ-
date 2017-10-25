var util=require("../../utils/util.js");
var app=getApp();
Page({
  data:{
    navList:["推荐","排行榜","搜索"],
    navcur: 0,
    searchId:1,
    timer:null,
    searchform:true,
    searchList:[],  //上拉加载
    list:[] //搜索缓存
  },
  onLoad:function(){
    var that=this;

    //获取搜索缓存
    wx.getStorage({
      key: 'gg',
      success: function(res) {
          //console.log(res.data)
          that.setData({
            list:res.data
          })
      } 
    })



    wx.getStorage({
      key: 'key',
      success: function(res) {
        console.log(res.data)
        that.setData({
          list:res.data
        })
          
      } 
    })


    util.indexResult(function(data){
      //console.log(data.data)
      that.setData({
        radioList:data.data.radioList,  //电台
        slider:data.data.slider,
        songList:data.data.songList

      })
    });

    util.topList(function(data){

      that.setData({
        topList: data.data.topList  //排行榜
      })
    });

    //热门搜索
    util.gethotKey(function(data){
      
      that.setData({
        hotkey: data.data.hotkey.slice(1, 9),
        hotkeyCur: data.data.hotkey.slice(0, 1)
      })
    })
  },
  //点击事件
  navtab:function(ev){
    var index = ev.currentTarget.dataset.navid;
    this.setData({
      navcur:index
    })
  },
  //打开排行榜详细
  openTopList:function(ev){
    var id = ev.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../toplist/toplist?id=' + id
    })
  },
  //搜索结果关键字
  bindKeywordInput:function(ev){
      //console.log(ev.detail.value)

      this.setData({
        searchKey:ev.detail.value,
        searchList:[]
      })
  },
  //搜索结果
  searchResult:function(){
    //搜索结果
    var that=this;
    var val = this.data.searchKey;
    var searchId = this.data.searchId;
    util.searchResult(val,searchId,function(data){
      //console.log(data)
      var searchList =that.data.searchList
      if(that.data.searchform)
        {
          searchList = data.data.song.list
          console.log(0)
        }
        else{
          searchList= searchList.concat(data.data.song.list);
          console.log(1)
        }
      that.setData({
        searchList:searchList,
        searchform:false
      })
      //console.log(that.data.searchList)
    })

    var list=this.data.list;
    var obj={};
    obj.content=this.data.searchKey;
    list.push(obj);
    
    //离线缓存
    wx.setStorage({
      key:"gg",
      data:list
    });

    this.setData({
      list:list
    })

  },
  //上拉加载
  scrolltolower:function(){
    //console.log(1)
    var that=this;
    clearTimeout(this.data.timer)
    this.data.timer=setTimeout(function(){
      that.setData({
        searchId:that.data.searchId+1,
      })
      //console.log(that.data.searchId);

      that.searchResult(); 
    },100)


  },
  onReachBottom: function () {
    //console.log(1)
  },
  //打开播放页面
  openPlayMusic:function(ev){
     //获取ID 
    var index=ev.currentTarget.dataset.searchid;
    //把一个 传到 getApp
    app.globalData.songlist=this.data.searchList[index]
    //跳转
    wx.navigateTo({
      url: '../playsong/playsong'
    })
  }
})