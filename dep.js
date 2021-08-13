class Dep {
  constructor(){
    this.subs = [];
  }

  addSub(watcher){
    this.subs.push(watcher)
  }

  notify(data){
    this.subs.forEach(subs=>subs.update(data))
  }
}