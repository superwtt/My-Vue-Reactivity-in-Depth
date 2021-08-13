class Watcher {
  constructor(options) {
    let { vm, cb, key } = options;
    this.vm = vm;
    this.cb = cb;
    this.key = key;

    console.log(this.cb)

    Dep.target = this;
    this.vm.$data[key];
    Dep.target = null;
  }

  update(data) {
    console.log("数据发生了变化");
    this.cb(data);
  }
}
