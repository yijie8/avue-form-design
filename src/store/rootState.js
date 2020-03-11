//配置vuex实例的state选项  this.$store.state.*** 来访问
const state = {
    startCity: {
        dataValue: '长春',
        dataCityName: '长春',
        dataTags: 'changchun',
        dataSpac: 'CCT',
        city: '长春'
    }, //城市控件选择城市
    endCity: {
        dataValue: '北京',
        dataCityName: '北京',
        dataTags: 'beijing',
        dataSpac: 'BJP',
        city: '北京'


    },
    queryMess: {}, //查询数据参数
    policy: {}, //政策原因
    defaultDate_: {
        fromTime: '',
        fromTimeStamp: '',
    }, //首页时间
    onlyHighSpeed: {
        trainType: '',
        trainValue: '',
    }, //高铁，动车
    // travelType: '', //因公因私
    travelTypeDisabled: '', //因公因私模式
    flagSwitch: false, //因公因私开关
    todayDate_: {
        todayTime: '',
        todayTimeStamp: '',
    },
    //下单页面的扯磁坐席信息
    trainTypeMessage: {

    },
    trainSeatMessage: {

    },
    peersList: [], //同行人列表
    privateAddObj: [], //因私新添加的乘车人
    privatePerson: [], //因私情况下所有已有乘车人的列表
    orderDetailMessages: null, //订单详情
    applicationForm: {}, //有无申请单模式
    mvpApplicationMess: {}, //前置申请单接口返回的信息
    centerPersonmessagearrs: [], //改签退票的数组人数
    personmessagearrs: [], //选择改签的人员列表


}
export default state;