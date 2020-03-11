//存放vuex的核心处理函数 异步调用this.$store.dispatch('getCounts',10)
export default {

    setStartCityOf({
        commit
    }, obj) {
        commit('setStartCity', obj)
    },
    setEndCityOf({
        commit
    }, obj) {
        commit('setEndCity', obj)
    },
    setQueryMessOf({
        commit
    }, obj) {
        commit('setQueryMess', obj)
    },
    setPolicyOf({
        commit
    }, obj) {
        commit('setPolicy', obj)
    },
    setDefaultDateOf({
        commit
    }, obj) {
        commit('setDefaultDate', obj)
    },
    setOnlyHighSpeedOf({
        commit
    }, obj) {
        commit('setOnlyHighSpeed', obj)
    },
    // setTravelTypeOf({
    //     commit
    // }, obj) {
    //     commit('setTravelType', obj)
    // },
    setTravelTypeDisabledOf({
        commit
    }, obj) {
        commit('setTravelTypeDisabled', obj)
    },
    //下单页面的车次坐席信息
    setTrainTypeMessageOf({
        commit
    }, obj) {
        commit('setTrainTypeMessage', obj)
    },
    setTrainSeatMessageOf({
        commit
    }, obj) {
        commit('setTrainSeatMessage', obj)
    },
    setPeersListOf({
        commit
    }, arr) { //同行人列表
        commit('setPeersList', arr)
    },
    setprivateArrOf({
        commit
    }, obj) {
        commit('setprivateObj', obj)
    },
    setPrivatePersonOf({
        commit
    }, obj) {
        commit('setPrivatePerson', obj)
    },
    setOrderDetailMessagesOf({
        commit
    }, obj) {
        commit('setOrderDetailMessages', obj)
    },
    //有无申请单模式
    setApplicationFormOf({
        commit
    }, obj) {
        commit('setApplicationForm', obj)
    },
    //前置申请单接口返回的信息
    setMvpApplicationMessOf({
        commit
    }, obj) {
        commit('setMvpApplicationMess', obj)
    },
    //改签退票的数组人数
    setCenterPersonmessagearrsOf({
        commit
    }, obj) {
        commit('setCenterPersonmessagearrs', obj)
    },
    setPersonmessagearrsOf({
        commit
    }, obj) {
        commit('setPersonmessagearrs', obj)
    },








}