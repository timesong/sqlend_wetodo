const kp_appid = 'kpXXXXXXXXXXXXX'
const kp_secret = 'XXXXXXXXXXXXXXXXXXX'
const default_headers = {'X-Kp-Appid': kp_appid}
const base_url = 'https://app.sqlend.com/apis/'

function loginAndGetUserInfo(callback) {
  wx.login({
    success: function (res) {
      // console.log(res)
      wx.request({
        url: base_url + 'weixin/openid?code=' + res.code,
        method: 'GET',
        header: default_headers,
        success: function(res){
          // console.debug(res)
          var openid = res.data.data;
          wx.getUserInfo({
            success: function (res) {
              // console.log(res)
              var data = {
                openid: openid,
                encryptedData: res.encryptedData,
                iv: res.iv
              }
              wx.request({
                url: base_url + 'weixin/userinfo',
                data: JSON.stringify(data),
                method: 'POST',
                header: default_headers,
                success: function(res){
                  // console.debug(res)
                  callback(res)
                }
              })
            }
          })
        }
      })
    }
  })
}

function uploadChoosedImage(callback) {
  wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
          var tempFilePaths = res.tempFilePaths

          wx.uploadFile({
              url: base_url + 'upload-files/',
              filePath: tempFilePaths[0],
              name: 'file',
              header: default_headers,
              success: function(res){
                  var data = res.data
                  typeof callback == "function" && callback(res)
              },
              fail: function(res) {
                  console.log(res)
              }
          })
      }
  })
}

function wepay() {
  wx.request({
      url: base_url + 'wepay',
      method: 'POST',
      data: {},
      header: {
          'X-Kp-Appid': kp_appid,
          'X-Kp-Secret': kp_secret
      },
      success: function(res) {
          // console.debug("unified_order result = ")
          // console.debug(res.data.data)
          var payObj = res.data.data.payObject;
          payObj["success"] = function(res) {
              console.log("pay successed.")
              // console.log(res)
          }
          payObj["fail"] = function(res){
              console.log("pay failed!")
          }
          wx.requestPayment(payObj)
      }
  })
}

function request(url, method, data, successCB, failCB) {
  var options = {
    url: base_url + url,
    method: method,
    header: default_headers,
    success: function(res){
      typeof successCB == "function" && successCB(res)
    },
    fail: function() {
      typeof failCB == "function" && failCB()
    }
  }

  if (data) {
    options.data = data
  }

  wx.request(options)
}

module.exports = {
  loginAndGetUserInfo: loginAndGetUserInfo,
  request: request,
}