// 简易版redux，实现全局事件监听回调，帮助组件间通信
var E = {
  listeners: [],
  listener: {
    add: function(ch, callback) {
      E.listeners[ch] ? E.listeners[ch].push(callback) : E.listeners[ch] = [callback];
      // console.log(E.listeners);
    },
    call: function(ch, obj) {
      if(!(ch in E.listeners)) {
        console.log("事件不在监听器中");
        return;
      }
      var arr = E.listeners[ch].slice();
      (function next() {
        var callback;
        while(callback = arr.shift()) {
          try {
            callback(obj);
            callback = null;
          } finally {
            callback && next();
          }
        }
      })();

    }
  }
}

export default E;