class Compile {
  constructor({ el, vm }) {
    console.log(el)
    this.el = document.querySelector(el);
    this.vm = vm;
    this.init();
  }

  init() {
    if (!this.el) throw new Error("请指定Vue作用的元素");
    let fragment = this.node2Fragment();
    this.compile(fragment);
    this.el.appendChild(fragment);
  }

  node2Fragment() {
    let fragment = document.createDocumentFragment();
    let childNodes = this.el.childNodes;

    this.toArray(childNodes).forEach((item) => {
      fragment.appendChild(item);
    });
    return fragment;
  }

  toArray(likeArray) {
    return [].slice.call(likeArray);
  }

  compile(node) {
    let nodes = node.childNodes;
    Array.from(nodes).forEach((nodeItem) => {
      if (this.isElement(nodeItem)) {
        let nodeAttributes = nodeItem.attributes;
        Array.from(nodeAttributes).forEach((attr) => {
          let dir = attr.name;
          let exp = attr.value;

          if (this.isDirective(dir)) {
            debugger
            this.update({ node: nodeItem, dir: dir.slice(2), exp });
          }
          if (this.isEvent(dir)) {
            this.eventHandler({ vm: this.vm, node: nodeItem, dir, exp });
          }
        });
      } else if (this.isInterpolation(nodeItem)) {
        this.update({ node: nodeItem, dir: "text", exp: RegExp.$1 });
      }
      if (nodeItem.childNodes && nodeItem.childNodes.length > 0) {
        this.compile(nodeItem);
      }
    });
  }

  update({ node, dir, exp }) {
    let fnName = `${dir}Updater`;
    let updateFn = this[fnName];
    if (!updateFn || typeof updateFn !== "function") {
      throw new Error("暂时无法解析该指令!");
    }
    updateFn.call(this, { vm: this.vm, node, exp });
    new Watcher({
      vm: this.vm,
      cb: () => {
        this[fnName]({ vm: this.vm, node, exp });
      },
      key: exp,
      
    });
  }

  //文本的更新
  textUpdater({ vm, node, exp }) {
    node.textContent = vm.$data[exp];
  }

  //model的更新
  modelUpdater({ vm, node, exp }) {
    debugger
    node.value = vm.$data[exp];
    node.addEventListener("input", (e) => {
      this.vm.$data[exp] = e.target.value;
    });
  }

  //html元素的更新
  htmlUpdater({ vm, node, exp }) {
    node.innerHtml = vm.$data[exp];
  }

  //事件的处理
  eventHandler({ vm, node, dir, exp }) {
    let event = dir.slice(1);
    let fn = vm.options.methods && vm.options.methods[exp];
    if (!fn || typeof fn !== "function") throw new Error("暂无支持方法!");
    node.addEventListener(event, fn.bind(vm));
  }

  //是否是元素
  isElement(node) {
    return node.nodeType === 1;
  }
  //是否是指令
  isDirective(directive) {
    return directive.indexOf("v-") === 0;
  }
  //是否是插值
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  //是否是事件
  isEvent(directive) {
    return directive.slice(0, 1) === "@";
  }
}
