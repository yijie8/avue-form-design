import { tripgBack, getStyle } from "tripg";

var skinStyle = function(Vue) {
  var tripSkin = {
    bind: function(el, binding) {
      getColor(el, binding);
    },
    update: function(el, binding) {
      if (binding.oldValue !== binding.value) {
        // 切换显示或消失
        getColor(el, binding);
      }
    }
  };
  Vue.directive("skin", tripSkin);
};
function getColor(el, binding) {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let arg = binding.arg;
  if (!userInfo) {
    return;
  }
  getStyle().then(res => {
    let color = userInfo.company_id in res && res[userInfo.company_id][arg];
    console.log("color :", color);
    if (!color) return;
    if (Array.isArray(color)) {
      let startC = color[0];
      let endC = color[1];
      el.style.background = `linear-gradient(${startC} 0%,${endC} 100%)`;
    } else {
      el.style.background = color;
    }
  });
}
export default skinStyle;
