/* 拉起支付 */

// 输入商品ID，回调接受两个参数：状态，第三方支付信息

const zfPay = {
  data() {
    return {
      zf_type: {
        'weixin': '3',
        'microProgramAli': '5',
        'alipay': '4',
      }
    }
  },
  methods: {
    zfPay(params) {
      let client = this.$store.state.client
      let zfData = {
        productid: params.productid,
        callback: params.callback,
        showError: params.showError || false,
        appPayType: params.appPayType || '',
        tradeNO: '',
        orderStr: '',
        data: {}
      }

      this.$api.reserve.submit(zfData.productid).then(data => {
        return data
      }).catch(err => {
        this.$error(err.errinfo)
      }).then(data => {
        let payType = ''
        if (client !== 'app') {
          payType = this.zf_type[client]
        } else {
          payType = params.appPayType
        }
        let req = {
          productid: zfData.productid,
          reserveid: data.reserveid,
          pay_type: payType,
          return_url: window.location.href
        }
        this.$api.reserve.earnest_pay(req).then(data => {
          if (client === 'weixin') {
            zfData.data = data
            this._wechat(zfData)
          } else if (client === 'microProgramAli') {
            try {
              data.order_str = JSON.parse(data.order_str)
            } catch (error) {
              // alert(error)
            }
            zfData.tradeNO = data.order_str.trade_no
            this._aliMircoProgram(zfData)
          } else if (client === 'alipay') {
            let div = document.createElement('div')
            div.id = "form"
            div.innerHTML = data.order_str
            document.body.appendChild(div)
            div.firstChild.submit()
          } else if (client === 'app') {
            zfData.data = data
            this._app(zfData)
          } else if (client === 'other') {

          }
        }).catch(err => {
          this.$error(err.errinfo)

          // alert(JSON.stringify(err));
        })
      })
    },
    _aliPay(data) {
      // console.log(data.orderStr);
      AlipayJSBridge.call("tradePay", {
        orderStr: data.orderStr
      }, function (result) {
        if (result.resultCode === '9000') {
          data.callback(0, res)
        } else {
          if (data.showError) {
            this.$error(result.resultCode)
          }
          data.callback(1, res)
        }
      });
    },
    _aliMircoProgram(data) {
      my.tradePay({
        tradeNO: data.tradeNO, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        success: res => {
          if (res.resultCode === '9000') {
            data.callback(0, res)
          } else {
            if (data.showError) {
              this.$error(result.resultCode)
            }
            data.callback(1, res)
          }
        },
        fail: res => {
          if (data.showError) {
            this.$error(res.resultCode)
          }
          data.callback(1, res)
        }
      });
    },
    _wechat(data) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', data.data, res => {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            data.callback(0, res)
          } else {
            if (data.showError) {
              this.$error(result.resultCode)
            }
            data.callback(1, res)
          }
        });
    },
    _app(data) {
      ZddKit.postMessage('zdd://com.zdd.electronics/pay', {
        ...data
      }, res => {
        if (res.errcode === 0) {
          data.callback(0, res)
        } else {
          if (process.env.CLIENT === 'test') {
            this.$error(JSON.stringify(res.errinfo))
            // alert(JSON.stringify(res.errinfo))
          } else {
            this.$error(JSON.stringify(res.errinfo))
          }
        }
      })
    },
  }
}

export {
  zfPay
}
