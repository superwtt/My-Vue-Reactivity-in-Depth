class Vue {
  constructor(options){
    this.$el = options.el;
    this.$data = options.data();
    this.methods = options.methods;

    console.log("this.$data===>",this.$data)
    console.log("this===>",this)

    new Observer(this,this.$data)

    if(this.$el){
      new Compile({el:this.$el, vm:this});
    }
  }
}

window.Vue = Vue;