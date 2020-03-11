//工具接口为了方便构建全局state自定义方法  获取属性  this.$store.getters.***

export default {
    //页面中引用的值
    startCity: state => state.startCity,
    endCity: state => state.endCity,
    getQueryMess: state => state.queryMess,
    getPolicy: state => state.policy,
    // getTravelType: state => state.travelType,//将存的值取出来
    getTravelTypeDisabled: state => state.travelTypeDisabled, //将存的值取出来
    getDefaultDate: state => state.defaultDate_, //将存的值取出来
    getTodayDate: state => state.todayDate_,
    getFlagSwitch: state => state.flagSwitch,
    getOnlyHighSpeed: state => state.onlyHighSpeed,
    //下单页面的车次坐席信息
    getTrainTypeMessage: state => state.trainTypeMess,
    getPeersList: state => state.peersList,
    privateAddObj: state => state.privateAddObj,
    gettPrivatePerson: state => state.privatePerson,
    getOrderDetailMessages: state => state.orderDetailMessages,
    getApplicationForm: state => state.applicationForm, //有无申请单模式
    getMvpApplicationMess: state => state.mvpApplicationMess, //前置申请单接口返回的信息
    getCenterPersonmessagearrs: state => state.centerPersonmessagearrs, //改签退票的数组人数
    personmessagearrs: state => state.personmessagearrs,











}