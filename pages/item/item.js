// item.js
Page({
  data: {
    id: 0,
    title: '',
    cate:'+',
    account: '',
    consumptionTypes: ["餐饮美食", "服饰美容", "生活日用", "充值缴费", "交通出行", "通讯物流", "休闲生活", "医疗保健", "图书教育", "酒店旅行", "其他消费"],
    pickerValue: "请选择消费类型",
    modalHidden: true,
    alertHidden: true,
    date: '',
    index: -1
  },
//   标题文本框
  bindTitleInput: function(e) {
      this.setData( {
          title: e.detail.value
      })
    // console.log(e.detail.value)
  },
//   金额文本框  
  bindAccountInput: function(e) {
      this.setData( {
          account: e.detail.value
      })
    // console.log(e.detail.value)
  },
  save: function() {
    var that = this
    if (this.data.title == '') {
        // 提示框
        that.setData({
          alertHidden: false,
          alertTitle: '标题不能为空'
        });
        return
    }

    var re = /^[0-9]+.?[0-9]*$/;         
    if (!re.test(this.data.account))  
    {  
         // 提示框
        that.setData({
          alertHidden: false,
          alertTitle: '金额只能是数字'
        });
        return
    }
     
    var type;
    switch(this.data.index){
      case -1:
        that.setData({
          alertHidden: false,
          alertTitle: '请选择消费类型'
        });
        break;
      case "0": type = "meal"; break;
      case "1": type = "clothing"; break;
      case "2": type = "living"; break;
      case "3": type = "payment"; break;
      case "4": type = "commuting"; break;
      case "5": type = "communication"; break;
      case "6": type = "leisure"; break;
      case "7": type = "health"; break;
      case "8": type = "education"; break;
      case "9": type = "traveling"; break;
      default: type = "other"; break;
    }
    console.log(type);
    var openid;
    wx.getStorage({
      key: 'openid',
      success(res) {
        openid = res.data;
        wx.request({
          url: "https://api.sunxiaochuan258.com/ChatAccounting/accounting",
          data: {
            openid: openid,
            item: that.data.title,
            type: type,
            price: that.data.account
          },
          header: {
            "Content-Type": "application/json"
          },
          success: function(res) {
            if(res.data.status != "success"){
              that.setData({
                alertHidden: false,
                alertTitle: '操作失败'
              });
            }
            else{
              wx.setStorage({
                data: res.data.msg,
                key: 'message_reply',
                success(res){
                  wx.setStorage({
                    data: that.data.title + ' ' + that.data.account.toString() + '元',
                    key: 'message_send',
                    success(res){
                      wx.navigateBack({});
                    }
                  })
                }
              });
            }
          },
          fail: function(e) {
            
          }
        })
     }
    })
    // // 本条数据打包成json
    // var record = {
    //   title: this.data.title,
    //   cate: this.data.cate,
    //   account: this.data.account,
    //   date: this.data.date
    // }
    // // accessToken放在record传入也可以，但为了更多的复用，我将它放在httpService时统一注入
    // // 访问网络
    // var app = getApp();
    // app.httpService(
    //   'item/add',
    //   record,
    //   function(response) {
    //     // 提示框
    //     that.setData({
    //       modalHidden: false,
    //       modalTitle: '添加成功'
    //     });
    //   }
    // );
  },
  update: function(){
    var that = this;
    // 本条数据打包成json
    var record = {
      title: this.data.title,
      cate: this.data.cate,
      account: this.data.account,
      date: this.data.date,
      id: this.data.id
    }
    // accessToken放在record传入也可以，但为了更多的复用，我将它放在httpService时统一注入
    // 访问网络
    var app = getApp();
    app.httpService(
      'item/update',
      record,
      function(response) {
        // 提示框
        that.setData({
          modalTitle: '修改成功',
          modalHidden: false
        });
      }
    );
  },
  delete: function () {
      var that = this;
      // 访问网络，删除账目
      var app = getApp();
      app.httpService(
          'item/del',
          {id: that.data.id},
          function(response){
            // 提示框
            that.setData({
              modalTitle: '删除成功',
              modalHidden: false
            });
          }
        );
  },
  onLoad: function(options) {
    // 接收id值
    this.setData({
      id:options.id,
    })
    var that = this;
    if (options.id) {
      // 访问网络，读取账目
      var app = getApp();
      app.httpService(
          'item/view',
          {id: options.id},
          function(response){
            that.setData({
              id: response.data.id,
              title: response.data.title,
              cate: response.data.cate,
              account: response.data.account,
              date: response.data.date
            });
          }
        );
    }
    // 初始化日期
//    获取当前日期
    var date = new Date();
//    格式化日期为"YYYY-mm-dd"
    var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
//    存回data，以渲染到页面
    this.setData({
    	date: dateStr
    })
  },
  onReady: function() {
        // 标题栏
    if (this.data.id) {
      wx.setNavigationBarTitle({
        title: '修改账目'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加账目'
      })
    }
  },

  // 关闭添加成功对话框
  hideModal: function() {
    this.setData({
      'modalHidden': true
    })
    // 返回上一页
    wx.navigateBack()
  },
  // 关闭表单验证对话框
  hideAlertView: function() {
    this.setData({
      'alertHidden': true
    })
  },
//  点击日期组件确定事件
  bindDateChange: function(e) {
    this.setData({
        date: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    this.setData({
      index: e.detail.value,
      pickerValue: that.data.consumptionTypes[e.detail.value]
    })
  },

  onShow: function(e){
    //console.log("shown")
  }
})