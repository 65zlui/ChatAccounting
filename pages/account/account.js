const app = getApp() //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"消费账单",
    count:'统计',
  datalist:[{
    item:"",
    type:"",
    account_date:"",
    price:""
  }],
  },

//跳转统计页面
  searchPrice:function(){
    wx.navigateTo({
     url: '/pages/count/count',      
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid;
    wx.getStorage({
      key: 'openid',
      success(res) {
        openid = res.data;
        wx.request({
          url: "https://api.sunxiaochuan258.com/ChatAccounting/inquiry/list",
          data: {
            openid: openid
          },
          header: {
            "Content-Type": "application/json"
          },
          success: function(res) {
            console.log(openid);
            let datalists=res.data.data; //拿到后端的data数据
            console.log(datalists);
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
            }
            that.setData({
             datalist:datalists  //修改账单列表
            });
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
          fail: function(e) {
            
          }
        })
     }
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

  souSearch: function (e) {
    var that = this;
    var openPicker = this.data.openPicker;
    var house_name = e.target.dataset.name;

    var msgList = that.data.msgList;
    this.setData({
      openPicker: !openPicker,
    })
    for (var i = 0; i < msgList.length; i++) {
      var keys = msgList[i].key;
      if (keys == 1) {
        msgList[i].name = house_name;
        that.setData({
          msgList: msgList,
          house_name: house_name
        })
      }
    }


    var menuNum = that.data.menuNum;
    var meunShow = this.data.meunShow;
    var menuSrc = "meunShow[" + menuNum + "].isShows";
    // console.log('menuNum:' + menuNum);
    for (var n = 0; n < meunShow.length; n++) {
      // 拼接 ，使我们可以获取到menuShow里面每一个isSHows
      var menuSrcs = meunShow[n].isShows;
      // console.log('menuSrcs:' + menuSrcs);
      // 解决重复点击不能隐藏的问题
      if (n != menuNum) {

        this.setData({
          menuSrcs: true
        });
      };
    };

    // 给当前点击的去反data中设置的meunShow，使之显示， 只写此处只会显示不能隐藏
    this.setData({
      [menuSrc]: !this.data.meunShow[menuNum].isShows
    });

  },

  menuClick: function (e) {
    // 获取通过wxml  data-hi="{{ idx }}" 传过来的索引
    var that = this;
    var menuNum = e.currentTarget.dataset.hi;
    that.setData({
      menuNum: menuNum
    })
    var name = e.currentTarget.dataset.name;
    if (name == that.data.name) {
      // console.log('==');
      that.setData({
        openPicker: !this.data.openPicker,
      })
    } else {
      // console.log('!=');
      that.setData({
        openPicker: true,
      })
    }

    that.setData({
      name: name
    })
    // console.log(name + ',' + menuNum);
    // 拼接 ，使我们可以获取到menuShow里面每一个isSHows
    var menuSrc = "meunShow[" + menuNum + "].isShows";
    // console.log('picker:' + this.data.openPicker);
    this.setData({
      needAnimation: true,
      menuNums: menuNum + 1
    });

    // 循环data中设置的meunShow
    for (var n = 0; n < this.data.meunShow.length; n++) {
      // 拼接 ，使我们可以获取到menuShow里面每一个isSHows
      var menuSrcs = "meunShow[" + n + "].isShows";
      // 解决重复点击不能隐藏的问题
      if (n != menuNum) {
        // 初始化，每次点击时先全部隐藏，但是重复点击不会隐藏
        this.setData({
          [menuSrcs]: true
        });
      };
    };

    // 给当前点击的去反data中设置的meunShow，使之显示， 只写此处只会显示不能隐藏
    this.setData({
      [menuSrc]: !this.data.meunShow[e.currentTarget.dataset.hi].isShows
    });
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