let   Util =  require('./utils/util.js');
let DOMAIN = 'https://mini.aimeichuang.cn';
App({
  appApi: {
    userLoginAPI: DOMAIN + '/Api/otherService/wechatCode',
    // 更新用户信息接口
    updateUserAPI: DOMAIN + '/OtherService/updateUser',
    getCity: DOMAIN + '/Api/House/cityList',
    getTopic: DOMAIN + '/Api/House/question',
    getResult: DOMAIN + '/Api/House/result',
    getEnjoy: DOMAIN + '/Api/House/enjoy',
    getBanner: DOMAIN + '/Api/House/adver'
  },
  globalData: {
   
  },
  onLaunch: function () {
    let that = this;
    that.userLogin();

    wx.getUserInfo({
      success: function (res) { console.log(res);
        wx.setStorageSync('userInfo', res.userInfo);
        that.globalData.userInfo = wx.getStorageSync('userInfo');
      }
    });
  },
getStorage:function (cb) {
  var that = this;
  if (wx.getStorageSync('token') && wx.getStorageSync('uid') && wx.getStorageSync('openid')){
    typeof cb == 'function' && cb({
      token: wx.getStorageSync('token'),
      openid: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid')
    })
  }else{
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res);
          //发起网络请求
          wx.request({
            url: getApp().appApi.userLoginAPI,
            data: {
              code: res.code,
              acid: 2
            },
            dataType: 'json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.data.code != 200) {
                wx.showModal({
                  title: '温馨提示！',
                  content: res.data.msg,
                  showCancel: false
                })
              } else {
                typeof cb == 'function' && cb({
                  token: res.data.result.item.token,
                  openid: res.data.result.item.openid,
                  uid: res.data.result.item.uid
                })
                console.log(res);
              }
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示！',
            content: '获取用户登录态失败！' + res.errMsg,
          })
        }
      }
    });
  }
},
  // 用户登录
  userLogin: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res);
          //发起网络请求
          wx.request({
            url: getApp().appApi.userLoginAPI,
            data: {
              code: res.code,
              acid:2
            },
            dataType: 'json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {console.log(res)
              if (res.data.code != 200) {
                wx.showModal({
                  title: '温馨提示！',
                  content: res.data.msg,
                  showCancel: false
                })
              } else {
              console.log(res); 
                wx.setStorageSync('token', res.data.result.item.token);
                wx.setStorageSync('uid', res.data.result.item.uid);
                wx.setStorageSync('openid', res.data.result.item.openid);
                that.uploadUserInfo();
              }
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示！',
            content: '获取用户登录态失败！' + res.errMsg,
          })
        }
      }
    });
  },
  // 检查用户登录
  checkUserLogin: function () {
    let that = this;
    wx.checkSession({
      success: function () {
      },
      fail: function () {
        //登录态过期 重新登录
        that.userLogin();
      }
    });
  },

  // 上传用户信息 wx.getUserInfo
  uploadUserInfo: function () {
    let that = this;
    that.checkUserLogin();
    wx.getSetting({
      success(res) {
        console.log("获取用户授权设置");
        // 检查用户是否授权，用户信息
        if (!res['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              console.log('获取用户信息成功');
              Util.wxRequest(getApp().appApi.updateUserAPI,
               {
                openid: wx.getStorageSync('openid'),
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl,
                gender: res.userInfo.gender,
                province: res.userInfo.province,
                city: res.userInfo.city,
                country: res.userInfo.country,
                acid:2
                },
                function(data){
                 console.log(data)
              })
            }
          });
        }
      }
    })
  },
})
