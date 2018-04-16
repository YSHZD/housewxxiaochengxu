let Utils = require('../../utils/util.js')
function itemId(arr, id){
   return arr.filter(function(item){
    return parseInt(item.id) === parseInt(id)
   })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
     cityId:-1,
     currentId:0,
     historyId:[],
     rules:[],
     answers:[],
     question_id:'',
     currentItem:null
  },
  radioChange: function(e) {
    let endObj = {};
    let that = this;
    let oldId;
    let ID = e.target.dataset.id;
    let newId = ID + '_' + e.detail.value;
    let historyids = that.data.historyId;
    historyids.push(newId);
    console.log(historyids);
    that.setData({
      historyId:historyids
    });
    function exist(big,sm){
      // console.log(big)
      // console.log(sm)
      let flag = true;
      for( let i = 0; i < big.length; i++){
        if (big[i].indexOf(sm) > -1 && flag && big[i].length != sm.length){
          flag = false;
          return i;
        }
      }
      return -1;
    }
    var rulesobj = that.data.rules;
    // console.log(rulesobj);
    var flag2 = true;
    for(let k=0;k<rulesobj.length;k++){
      if (flag2){
        let oldkey = exist(rulesobj, that.data.historyId.join(','));
        console.log(oldkey)
        if (oldkey != -1) {
          console.log(rulesobj[oldkey])
          var newrule = rulesobj[oldkey].split(',');
          console.log(newrule)
          let hisID = that.data.historyId;
          console.log(newrule[hisID.length])
          oldId = newrule[hisID.length].split('_')[0];
          // for (let k = 0; k < newrule.length; k++){
          //   if (newrule[k] == hisID[hisID.length - 1] ){
          //     console.log(hisID[hisID.length - 1])
          //     console.log(newrule[k + 1])
          //     oldId = newrule[k + 1].split('_')[0]
          //   }
          // }
          flag2 = false
        }
      }
    }
    if(oldId){
      that.setData({
        currentItem:itemId(that.data.answers,oldId),
      })
    }else{
      // console.log(that.data.historyId)
      // console.log('end------')
      wx.redirectTo({
        url: '/pages/result/result?logic_result=' + that.data.historyId + '&question_id=' + that.data.question_id + '&city_id=' + that.data.cityId
      })
    }
  },
  back:function(){
    var that = this;
    let historysplit = that.data.historyId;
    console.log(historysplit);
    if(historysplit.length>0){
      let curId = historysplit.pop();
       that.setData({
        currentItem:itemId(that.data.answers,curId),
        historyId:historysplit
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    Utils.wxRequest(getApp().appApi.getTopic, { city_id:options.cityId},function(data){
      console.log(data)
      that.setData({
        question_id: data.data.result.question_id,
        answers:data.data.result.list,
        rules: data.data.result.logic_list,
        cityId: options.cityId,
        currentItem: itemId(data.data.result.list, data.data.result.list[0].id),
      })
      console.log(that.data)
    })
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