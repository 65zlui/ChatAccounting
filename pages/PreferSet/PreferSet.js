// pages/PreferSet/PreferSet.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    AvatarAddress: '',//机器人头像地址
    ShowViewAva: false ,//样式显示or隐藏
    ShowViewCha: false ,
    ShowViewChaCus: false ,
    ShowViewAccCus: false ,
    BackColor: '#eee',//边框环颜色
    BackColor1: '#eee',//按钮视图颜色
    BackColor2: '#eee',
    BackColor3: '#eee',
    BackColor4: '#eee',
    ChaCus: ['',''],//添加的聊天指定回答
    AccCus: ['',''],//添加的记账指定回答
  },
  // 以下4个点击事件是点击则扇形视图和边框环变色，同时显示对应的功能盒
  Tap1: function () {
    var that = this;
    that.setData({
      ShowViewAva: (!that.data.ShowViewAva),
      ShowViewCha: "",
      ShowViewChaCus:"",
      ShowViewAccCus: "",
    })
    if(that.data.BackColor1 == '#eee'){
      that.setData({
        BackColor: '#00eeee',
        BackColor1: '#00eeee',
        BackColor2: '#eee',
        BackColor3: '#eee',
        BackColor4: '#eee',
      })
    }else{
      that.setData({
        BackColor: '#eee',
        BackColor1: '#eee'
      })
    }
  },
  Tap2: function () {
    var that = this;
    that.setData({
      ShowViewAva: "",
      ShowViewCha: (!that.data.ShowViewCha),
      ShowViewChaCus:"",
      ShowViewAccCus: "",
    })
    if(that.data.BackColor2 == '#eee'){
      that.setData({
        BackColor: '#00eeee',
        BackColor1: '#eee',
        BackColor2: '#00eeee',
        BackColor3: '#eee',
        BackColor4: '#eee',
      })
    }else{
      that.setData({
        BackColor: '#eee',
        BackColor2: '#eee'
      })
    }
  },
  Tap3: function () {
    var that = this;
    that.setData({
      ShowViewAva: "",
      ShowViewCha: "",
      ShowViewChaCus: (!that.data.ShowViewChaCus),
      ShowViewAccCus: "",
      
    })
    if(that.data.BackColor3 == '#eee'){
      that.setData({
        BackColor: '#00eeee',
        BackColor1: '#eee',
        BackColor2: '#eee',
        BackColor3: '#00eeee',
        BackColor4: '#eee',
      })
    }else{
      that.setData({
        BackColor: '#eee',
        BackColor3: '#eee'
      })
    }
  },
  Tap4: function () {
    var that = this;
    that.setData({
      ShowViewAva: "",
      ShowViewCha: "",
      ShowViewAccCus: (!that.data.ShowViewAccCus),
      ShowViewChaCus:"",
    })
    if(that.data.BackColor4 == '#eee'){
      that.setData({
        BackColor: '#00eeee',      
        BackColor1: '#eee',
        BackColor2: '#eee',
        BackColor3: '#eee',
        BackColor4: '#00eeee'
      })
    }else{
      that.setData({
        BackColor: '#eee',
        BackColor4: '#eee'
      })
    }
  },
//changeAva事件是让用户选择图片成为头像，并保存在本地用户文件
ChangeAva: function () {
  var that = this;
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success (res) {
      // 返回选定照片的本地文件路径列表，存储在TempFilePaths中
      const TempFilePaths = res.tempFilePaths
      wx.saveFile({//将选定照片保存在本地用户文件
        tempFilePath: TempFilePaths[0],
        success (res) {
          const SavedFilePath = res.savedFilePath
          that.setData({
            AvatarAddress:SavedFilePath//修改头像为本地用户文件中的照片
          })
          wx.setStorage({ //将头像地址存入缓存
            data: SavedFilePath,
            key: 'TheAvatarAddress'
          })
        }
      })
    }
  })
},

  formSubmit(e) {//提交性格选择结果
    var Myopenid
    wx.getStorage({
      key: 'openid',
      success(res) {
        Myopenid = res.data;
        console.log(Myopenid);
        wx.request({
          url: 'https://api.sunxiaochuan258.com/ChatAccounting/preferences',
          method: "GET",
          data:{
            openid: Myopenid,
            personality: e.detail.value.Radio
          },
          Header:{
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(Myopenid);
            console.log(res.data);
            var jsonText = res.data.status//JSON.parse(res.data);
            console.log(jsonText);
            if(jsonText=="success"){
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000
              });
            }
          },
          fail: function (res) {
            console.log(".....CharacterChangeFail.....");
          }
        })
      }
    })
  },
  AddChaCus: function () {
    var Myopenid;
    var CC = this.data.ChaCus
    wx.getStorage({
      key: 'openid',
      success(res) {
        Myopenid = res.data;
        console.log(Myopenid);
        wx.request({
          url: 'https://api.sunxiaochuan258.com/ChatAccounting/preferences',
          method: "GET",
          data:{
            openid: Myopenid,
            ChaCus: CC
          },
          Header:{
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(Myopenid);
            console.log(res.data);
            var jsonText = res.data.status//JSON.parse(res.data);
            console.log(jsonText);
            if(jsonText=="success"){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              });
            }
          },
          fail: function (res) {
            console.log(".....AddFail.....");
          }
        })
      }
    })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    });
  },
  AddAccCus: function () {
    var Myopenid;
    var AC = this.data.AccCus
    wx.getStorage({
      key: 'openid',
      success(res) {
        Myopenid = res.data;
        console.log(Myopenid);
        wx.request({
          url: 'https://api.sunxiaochuan258.com/ChatAccounting/preferences',
          method: "GET",
          data:{
            openid: Myopenid,
            ChaCus: AC
          },
          Header:{
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(Myopenid);
            console.log(res.data);
            var jsonText = res.data.status//JSON.parse(res.data);
            console.log(jsonText);
            if(jsonText=="success"){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              });
            }
          },
          fail: function (res) {
            console.log(".....AddFail.....");
          }
        })
      }
    })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({ //从缓存获取头像地址
      key: 'TheAvatarAddress',
      success (res) {
        //console.log(res.data)
        that.setData({
          AvatarAddress: res.data
        })
        //console.log(that.data.AvatarAddress)
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