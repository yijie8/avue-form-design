import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import Home from '@/pages/index'


// import Home from '@/views/Home.vue'
// //首页
// import home from '@/components/home.vue'
// //列表及组件
// import trainList from '@/components/trainList/trainList.vue'
// import header from '@/components/trainList/components/header.vue'
// import date from '@/components/trainList/components/date.vue'
// import filterTrain from '@/components/trainList/components/filterTrain.vue'


// import login from '@/components/login.vue'
// import InputPassengers from '@/components/InputPassengers.vue'
// import ApplyChanges from '@/components/ApplyChanges.vue'




// import order_results from '@/components/order/order_results.vue'
// import order_list from '@/components/order/order_list.vue'
// import order_detail from '@/components/order_detail/order_detail.vue'


// import orderInformation from '@/components/order_detail/components/orderInformation.vue'
// import trainInformation from '@/components/order_detail/components/trainInformation.vue'
// import PassengerInformation from '@/components/order_detail/components/PassengerInformation.vue'
// import chargeDetails from '@/components/order_detail/components/chargeDetails.vue'



// import city from '@/page/city.vue'

// import PrivateInceat from '@/page/PrivateInceat.vue'
// import orderKnow from '@/page/orderKnow.vue'
// import countDown from '@/page/countDown.vue'






import formList from '@/pages/formList'
import ScopeList from '@/pages/scopeList'
import ScopeAdd from '@/pages/scopeAdd'
import Form from '@/pages/form'

Vue.use(Router)

// export default new Router({
const router = new Router({
    mode: 'hash',
    // mode: 'history',
    base: '',
    // base:'tripTrain',
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },

        {
            path: '/form',
            name: 'form',
            component: Form
        },
        {
            path: '/formlist',
            name: 'formlist',
            component: formList
        },
        {
            path: '/scope_list',
            name: 'scopeList',
            component: ScopeList
        },
        {
            path: '/scope_add',
            name: 'scopeAdd',
            component: ScopeAdd
        }

    ]
});

router.beforeEach((to, from, next) => {
    next();
});


export default router;