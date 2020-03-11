
import { pay } from "tripg";
import router from "../router";
import {isPc} from './dom'
import Mint from "mint-ui";
export  function payAll(
    paytype,//1 非微信浏览器 2 支付宝  
    order_no, //订单号
    orderPrice, //支付金额
    user_info, //登陆用户信息
    messDetails, //订单详细信息obj
    payId, // 11机票 12酒店 27用车
    calback //支付回调函数
  ){ 
    let orderstatus = messDetails.orderstatus,
        go_cause = messDetails.traveltype;
    let productName,sign,platformId;
    switch (payId) {//11机票 12酒店 27用车
        case "11":
            productName = '机票支付';
            sign = '986CD980-17CA-4FF4-A158-6067D2721A56';
            platformId = '27'; 
            break;
        case "12":
            productName = '酒店支付';
            sign = 'FE29D133-468D-403B-8428-0168C968CAC1';
            platformId = '14';
            break;
        case "27":
            productName = '用车支付';
            sign = '986CD980-17CA-4FF4-A158-6067D2721A56';
            platformId = '12';
            break;
        default:
            break;
    }
    let callBackUrl = location.href;
    let param = {
      productOrderId: order_no,//'订单号',
      productName: productName,
      payMoney: orderPrice,//'付款金额',
      payBody: '订单描述',
      callBackUrl: callBackUrl,//'跳转页面地址',
      payId: payId, //产品线ID 11机票 12酒店 27用车
      sign: sign,//后台有默认值可不传。
                //产品sign  酒店 FE29D133-468D-403B-8428-0168C968CAC1 
                //机票 986CD980-17CA-4FF4-A158-6067D2721A56 
                //用车 986CD980-17CA-4FF4-A158-6067D2721A56;
            
      userId: user_info.user_code, //会员编号
      userName: user_info.lastname + user_info.firstname, //会员姓名
      platformId: platformId, //平台id  酒店14   用车 12 机票 27  //后台有默认值可不传。
      companyId: user_info.company_id , //公司id
      departmentId: user_info.dept_id, //部门id
      orderType: '0', //订单类型 0 正常 1退票 2 改签
      orderStatus: orderstatus, //订单状态码
      ppCode: go_cause //1公2私
    };
    console.log(pay,pay.wxpayQr,'pay.wxpayQr');
    //return;
    if (isPc()) { //pc端扫码支付
      param.callBackUrl = 'http://pre.tmc.tripg.net/index.php/proframe/frame?_callback='+encodeURI(location.href);
      switch (paytype) {
        case 1: //微信
          pay.wxpay(param).then((data)=>{
             console.log(data,'支付');
             if(!!data.er){
              Mint.Toast('服务器异常，请稍后再试。')
             }else{
                localStorage.setItem('pay_img',data.url); //将接口返回的二维码地址存放本地localStorage中，在跳转到扫码页面时调取
                router.push({//跳转扫码页 ,扫码页路由离开时 localStorage removeItem掉
                  name:'payPage',
                  query:{
                  orderPrice:orderPrice,
                  order_no:order_no,
                  orderId : data.orderId
                  }
                })
             }
             
            //calback(data) //微信扫码 不用calback回调
          });
          break;
        case 2: //支付宝
          pay.alipay(param).then((data)=>{
             console.log(data);
            calback(data)
          });
          break;
        default:
          break;
      }
    }else{ //移动端支付
        switch (paytype) {
          case 1: //非微信浏览器
            pay.wxpay(param).then((data)=>{
              // console.log(data);
              //calback(data)
            });
            break;
          case 2: //支付宝
            pay.alipay(param).then((data)=>{
              // console.log(data);
              calback(data)
            });
            break;
          default:
            break;
        }
        
    }
  
  
};

