let Utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    title:'',
    dec:'',
    list:[],
    banner:[],
    indicatorDots: false,
    autoplay: false,
    interval: 4000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    Utils.wxRequest(getApp().appApi.getResult,
    {
      question_id: options.question_id,
      logic_result: options.logic_result

    }
    ,function(data){
      console.log(data)
      that.setData({
        title: data.data.result.item.title,
        dec: data.data.result.item.content,
        src: data.data.result.item.img
      })
    }
    ); 
    Utils.wxRequest(getApp().appApi.getEnjoy,
      {
        city_id: options.city_id
      }
      , function (data) {
        console.log(data)
        that.setData({
          list: data.data.result.list,
        })
      }
    );
  Utils.wxRequest(getApp().appApi.getBanner,
    {
      city_id: options.city_id
    }
    , function (data) {
      that.setData({
        banner: data.data.result.list,
      })
    }
  )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})