//整合各个模块，创建并导出vuex实例
import Vue from 'vue';
import Vuex from 'vuex';
import state from './rootState.js';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage,
    key: "trainVuex",
    // reducer: (state) => ({ Date: state.Date }),
    /**  reducer=>不存什么值
     * filter=>哪些 mutation 触发存储，默认是全部 ||连接
     * modules =>only save user module
     */
})
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
    strict: debug,
    plugins: [vuexLocal.plugin],
    state,
    getters,
    actions,
    mutations,
});

export default store;