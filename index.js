const vm = new Vue({
  el: "#app",
  data() {
    return {
      text: "你好，这是初始值:我是wangtingting",
    };
  },
});

const app = document.getElementById("app");

// app.innerHTML = vm.$data.text

console.log(vm.$data.text)

setTimeout(()=>{
  vm.$data.text = '页面数据更新成功！'; // 模拟数据变化
},3000)

console.log(vm.$data.text)