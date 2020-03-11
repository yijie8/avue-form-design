import Vue from 'vue';
import Load from '~/single/loading.vue';
const Indicator = Vue.extend(Load);
let instance;
export default {
  install : Vue => {
    Vue.prototype.Load = loading
  }
};
let loadTimeOut;
const loading = {
  open() {
    if (!instance) {
      instance = new Indicator({
        el: document.createElement('div')
      });
    }
    if (instance.visible) {
      return;
    }
    document
      .body
      .appendChild(instance.$el);
    Vue.nextTick(() => {
      instance.visible = true;
      clearTimeout(loadTimeOut)
      loadTimeOut = setTimeout(() => {
        console.log('自动关闭loading')
        instance.visible = false
      }, 60000);
    });
  },

  close() {
    if (instance) {
      clearTimeout(loadTimeOut)
      instance.visible = false;
    }
  }
}
