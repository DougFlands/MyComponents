// 仿Vue $on $off $once 解决app.js内请求异步问题
// 使用方式：app.js的onLaunch加入 event.call(this)

export default function event() {
  this.$on = function (event, fn) {
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn);
      }
    } else {
      (this._globalEvent[event] || (this._globalEvent[event] = [])).push(fn);
    }
  }

  this.$once = function (event, fn) {
    function on() {
      this.$off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
  }

  this.$off = function (event, fn) {
    // all
    if (!arguments.length) {
      this._globalEvent = Object.create(null);
      return
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this.$off(event[i$1], fn);
      }
      return
    }
    // specific event
    var cbs = this._globalEvent[event];
    if (!cbs) {
      return
    }
    if (!fn) {
      this._globalEvent[event] = null;
      return
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
  }

  this.$emit = function (event) {
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && this._globalEvent[lowerCaseEvent]) {
        console.log(`Event [${lowerCaseEvent}] is emitted ?`);
      }
    }
    var cbs = this._globalEvent[event];
    if (cbs) {
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], this, cbs);
      }
    }
  }

  this._globalEvent = {}

  const invokeWithErrorHandling = function (
    handler,
    context,
    args,
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return console.log(e, vm, info + " (Promise/async)") });
      }
    } catch (e) {
      console.log(e, context, info);
    }
    return res
  }

  const isPromise = function (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  const isDef = function (v) {
    return v !== undefined && v !== null
  }

}
