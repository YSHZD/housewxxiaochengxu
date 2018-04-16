let Util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentCity:'',
    url:'',
    array: [],
    cityId:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },
  bindPickerChange: function(e) {
    console.log(e)
    this.setData({
      currentCity: this.data.array[e.detail.value].city,
      cityId: this.data.array[e.detail.value].id
    });
    console.log(this.data);
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
    var page = this
    Util.wxRequest(getApp().appApi.getCity, {}, function (data) {
      page.setData({
        array: data.data.result.list
      })
    });

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=4124pGddxXrvjHS3mv73nni4D7ZVDaGC&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var flag = 1;
        console.log(res);
        var nowcity = res.data.result.addressComponent.city;
        let cityArray = page.data.array;
        for (let k = 0; k < cityArray.length; k++) {
          if ((cityArray[k].city).indexOf(nowcity) > -1 || (nowcity).indexOf(cityArray[k].city) > -1) {
            console.log(cityArray[k].id);
            flag = 2;
            page.setData({
              cityId: cityArray[k].id
            });
          } else if (flag == 1 && k == (cityArray.length - 1)) {
            wx.showModal({
              title: '温馨提示',
              content: '不在服务城市范围内请手动选择城市',
              showCancel: false
            })
          }
        }
        page.setData({ currentCity: nowcity });

      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
        wx.showModal({
          title: '温馨提示',
          content: '请手动选择城市',
          showCancel: false
        })
      },

    })
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