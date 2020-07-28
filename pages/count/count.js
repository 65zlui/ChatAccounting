// pages/count/count.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    out:'总支出',
    datalist:[{
      type:"",
      price:""
    }]

  },
  /*日期 */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value //得到时间选择器的内容
    })
    var that = this;
    var openid;
    wx.getStorage({
      key: 'openid',
      success(res) {
        openid = res.data;

        //账单列表加载
     wx.request({
      url: "https://api.sunxiaochuan258.com/ChatAccounting/inquiry/statistic",
      data: {
        openid: openid,
        month: e.detail.value
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(openid);
      let datalists=res.data.data; //拿到后端的data数据
      console.log(datalists);
      let data_total = {
        type: "消费总额",
        price: 0
      };
      let datalists_result = [];
      datalists_result[0] = data_total;
      for (var i in datalists){
        var type_en = datalists[i].type;
        switch(type_en){
          case "meal": datalists[i].type = "餐饮美食"; break;
          case "clothing": datalists[i].type = "服饰美容"; break;
          case "living": datalists[i].type = "生活日用"; break;
          case "payment": datalists[i].type = "充值缴费"; break;
          case "commuting": datalists[i].type = "交通出行"; break;
          case "communication": datalists[i].type = "通讯物流"; break;
          case "leisure": datalists[i].type = "休闲生活"; break;
          case "health": datalists[i].type = "医疗保健"; break;
          case "education": datalists[i].type = "图书教育"; break;
          case "traveling": datalists[i].type = "酒店旅行"; break;
          case "other": datalists[i].type = "其他消费"; break;
          default: datalists[i].type = "未知分类"; break;
        }
        datalists_result[parseInt(i) + 1] = datalists[i];
        // console.log(i + 1);
        datalists_result[0].price += parseFloat(datalists_result[parseInt(i) + 1].price);
      } 
      console.log(datalists_result);      
        that.setData({
        datalist:datalists_result //修改原本账单中的数据
        })
        switch(res.data.status)
              {
                case "scuccess":console.log("成功");break;
                case "missing_param" : cosole.log("参数缺失");break;
                case "invalid ":wx.showModal({
                  title: '提示',
                  content: '你无权限访问',
                });break;
                  case "failed":wx.showModal({
                    title: '提示',
                    content: '获取账单失败',
                  
                  });break;
                  case "not_exist":wx.showModal({
                    title: '提示',
                    content: '您目前没有账单显示哦',
                  });break;
              }
      },
      fail: function(e) {}
    })
  
     }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
   
   
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})