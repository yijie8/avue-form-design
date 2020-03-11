//改版store中各种状态的地方  同步调用this.$store.commit('方法名')

function resetiptParams(obj) { //重置清空
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = ""
        }
    }
}

export default {
    setStartCity(state, obj) { //选出的城市
        state.startCity = obj;
    },
    setEndCity(state, obj) { //选出的城市
        state.endCity = obj;
    },
    setQueryMess(state, obj) {
        state.queryMess = obj;
    },
    setPolicy(state, obj) {
        state.policy = obj
    },
    setDefaultDate(state, obj) {
        state.defaultDate_ = obj;
    },
    setTodayDate(state, obj) {
        state.todayDate_ = obj;
    },
    setOnlyHighSpeed(state, obj) {
        state.onlyHighSpeed = obj;
    },
    // setTravelType(state, obj) {
    //     state.travelType = obj;
    // },
    setTravelTypeDisabled(state, obj) {
        state.travelTypeDisabled = obj;
    },
    //用工隐私模式开关
    setFlagSwitch(state, obj) {
        state.flagSwitch = obj;
    },
    //下单页面的车次坐席信息
    setTrainTypeMessage(state, obj) {
        state.trainTypeMessage = obj;
    },
    setTrainSeatMessage(state, obj) {
        state.trainSeatMessage = obj;
    },
    setPeersList(state, arr) { //同行人列表
        state.peersList = arr
    },
    setprivateObj(state, obj) {
        state.privateAddObj = obj
    },
    setPrivatePerson(state, obj) { //修改已有乘车人的信息
        state.privatePerson = obj
    },

    setOrderDetailMessages(state, obj) { //修改已有乘车人的信息
        state.orderDetailMessages = obj
    },
    setApplicationForm(state, obj) { //有无申请单模式
        state.applicationForm = obj
    },

    setMvpApplicationMess(state, obj) { //前置申请单接口返回的信息
        state.mvpApplicationMess = obj
    },
    setCenterPersonmessagearrs(state, obj) { //改签退票的数组人数
        state.centerPersonmessagearrs = obj
    },
    setPersonmessagearrs(state, obj) { //修改改签人员信息
        state.personmessagearrs = obj
    },






}