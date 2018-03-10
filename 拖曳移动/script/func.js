/* 首页 */

/* Login & reg */
// 检测用户名
var checkUser = function (user) {
  if (user == '') {
    return '请输入用户名'
  } else if (!/^[a-zA-Z0-9]+$/.test(user)) {
    return '用户名仅能包含数字和字母'
  } else if (user.length < 4 || user.length > 16) {
    return '用户名长度仅能为4-10位'
  } else {
    return ''
  }
}
// 检测密码
var checkPw = function (pw) {
  if (pw == '') {
    return '请输入密码'
  } else if (!/^[a-zA-Z0-9]+$/.test(pw)) {
    return '密码只能包含数字和字母'
  } else if (pw.length < 4 || pw.length > 16) {
    return '密码长度仅能为4-10位'
  } else {
    return ''
  }
}
// 第二次输入密码
var checkTwoPw = function (pw, twoPw) {
  if (pw != twoPw) {
    return '两次输入密码不一致'
  } else {
    return ''
  }
}

//ajax前置
var ajaxProxy = function (value) {
  value = 'http://127.0.0.1:3000' + value
  return value
}

// 按两下退出
var exitApp = function () {
  api.addEventListener({
    name: 'keyback'
  }, function (ret, err) {
    api.toast({
      msg: '再按返回键退出',
      duration: 2000,
      location: 'bottom'
    })
    api.addEventListener({
      name: 'keyback'
    }, function (ret, err) {
      api.closeWidget({
        id: 'A6065080309722', //这里改成自己的应用ID
        retData: {
          name: 'closeWidget'
        },
        silent: true
      });
    });
    setTimeout(function () {
      exitApp();
    }, 3000)
  });
}
