class Observer {
  constructor(vm,data) {
    this.vm = vm;
    this.oberserve(data);
  }

  oberserve(data) {
    if (!data || typeof data !== "object") return;
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(data, key, value) {
    const node = document.getElementById("app");
    this.oberserve(value);

    let dep = new Dep();

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        // let watcher = new Watcher({
        //   vm: node,
        //   cb:v=>node.innerText=v,
        //   key
        // });
        // dep.addSub(watcher)
        return value;
      },
      set(newValue) {
        value = newValue;
        dep.notify(newValue);
      },
    });
  }
}
