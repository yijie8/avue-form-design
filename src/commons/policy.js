// 用于处理政策
import {
  api
} from 'tripg';

import {
  in_array
} from './function.js'
import { isNullOrUndefined } from 'util';

let userInfo_ = JSON.parse(localStorage.getItem("userInfo"));
let plane_config = JSON.parse(localStorage.getItem("plane_config"));

// @param list 数据
// @param cityName 到达城市 必须 接口要的值 
/**
 * 机票验政策
 * @param {array} list 页面上的数据
 * @param {object} params 路由上的params
 * @param {boolean} one 是否为仓位列表页
 */
export async function policy_make(list, params,one=false) {

  //兼容 老版
  // let {endCity} = params; 
  // let cityName = endCity;
//

  console.log('params params params====> :', params);
  let price = "0";
  let res_zc = await api.ajax("CheckPriceBy",{
    // "deptTime": "15:45",// TODO 
    "rangeType": "",
    "optionsId": "2", // 政策判断
    // "price": price,// TODO
    "cabin": "A",
    "discount": "100",
    "secretId": "",
    "dateTime": params.startTime,
    "deptCity": params.startSzm,
    "arriveCity": params.endSzm,
    "user_id": params.user_id,
    "cityName": params.endCity,
    "checkRule": `{"cityName":"${params.endCity}","price":"0","carrier":"${params.Carriers}","cabin":"A","discount":"100"}`,
    "product_id": '11',
    "carrier": params.Carriers,
    "companyId":userInfo_.company_id
  });
  console.log('res_zc ============> :', res_zc);
  res_zc = res_zc.Result;
  if("Policy_List" in res_zc && "PolicyList" in res_zc.Policy_List && res_zc.Policy_List.PolicyList.length>0){
    res_zc = res_zc.Policy_List.PolicyList[0];
  }else{
    return list;
  }


  let allkeys = Object.keys(res_zc);
  // 找出所有可用的政策
  let flightKeys = ["FlightList_discount","FlightList_division","FlightList_position","FlightList_price"];
  flightKeys = allkeys.filter(k=>{return !isNullOrUndefined(res_zc[k]) && in_array(k,flightKeys) });

  // 如果没有政策全部显示符合
  let allfh =  flightKeys ? false : true;

  console.log(res_zc,"<<<<<<<<<<<<<<<<<<<zc");
  // let allfh = false;
  // try {
  //   allfh = res_zc.length == 0 ? true : false;
  // } catch (e) {
  //   allfh = false;
  // }

  let fh = false; //是否符合
  let fhcw = []; //舱位
  let fhgs = []; //航空公司
  let fhprice_start = 0;
  let fhprice_end = 999999999;
  let fh_dz_start = 0;
  let fh_dz_end = 100;
  flightKeys.forEach((fk_property_name) => {
    let zc_item = res_zc[fk_property_name];
    let { compare_number,value_compare } = zc_item;
    //舱位
    if (fk_property_name == "FlightList_position") { 
      //compare_number: "经济舱|Y,头等舱|F" "根据政策，您所预订的航班舱位应在经济舱|Y,头等舱|F中选择"
      let ar = [];
      if(compare_number.indexOf(",")>0){
        ar = compare_number.split(",");
      }else{
        ar.push(compare_number);
      }
      fhcw = ar.map(cw => {
        return cw.split("|")[1];
      });
    //取价格政策
    } else if (fk_property_name == "FlightList_price") { 
      //compare_number: "200,1500" 根据政策，您所预订的机票价格应200,1500元 
      // compare_number: "1000" value_compare: "<" 根据政策，您所预订的机票价格应小于1000元

      if (compare_number.indexOf(",") > 0) {
        fhprice_start = parseFloat(compare_number.split(",")[0]);
        fhprice_end = parseFloat(compare_number.split(",")[1]);
      } else {
        if(value_compare=="<"){
          fhprice_end = parseFloat(compare_number);
        }
        if(value_compare==">"){
          fhprice_start = parseFloat(compare_number);
        }
      }
    //取打折政策
    } else if (fk_property_name == "FlightList_discount") {

      if (compare_number.indexOf(",") > 0) {
        fh_dz_start = parseFloat(compare_number.split(",")[0])*10;
        fh_dz_end = parseFloat(compare_number.split(",")[1])*10;
      } else {
        if(value_compare=="<"){
          fh_dz_end = parseFloat(compare_number)*10;
        }
        if(value_compare==">"){
          fh_dz_start = parseFloat(compare_number)*10;
        }
      }
    //航空公司
    } else if (fk_property_name == "FlightList_division") {
      //"中国南方航空|CZ,中国国际航空|CA,中国东方航空|MU,海南航空公司|HU,大新华航空公司|CN,深圳东海航空公司|DZ,上海航空公司|FM,天津航空公司|GS,四川航空公司|3U,武汉东星航空|8C,春秋航空|9C,长安航空|9H,云南红土航空公司|A6,九元航空公司|AQ,奥凯航空公司|BK,云南瑞丽航有限公司|DR,成都航空|EU,福州航空有限公司|FU,华夏航空有限公司|G5,浙江长龙航空公司|GJ,北部湾航空|GX,多彩贵州航空|GY,上海吉祥航空|HO,首都航空|JD,幸福航空|JR,中国联合航空|KN,昆明航空|KY,厦门航空公司|MF,河北航空|NS,西部航空|PN,青岛航空|QW,江西航空|RY,山东航空|SC,西藏航空|TV,乌鲁木齐航空|UQ,河南航空|VD,穆罕航空|W5,云南英安航空|YI,深圳航空|ZH,祥鹏航空|8L,扬子江快运航空|Y8,桂林航空|GT"


      let ar = [];
      if(compare_number.indexOf(",")>0){
        ar = compare_number.split(",");
      }else{
        ar.push(compare_number);
      }
      fhgs = ar.map(gs => {
        return gs.split("|")[1];
      });
    }
  });


  if(one){
    list.forEach(jp_ca_item => {
      fh = (in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0) && // 舱位
        jp_ca_item.Price <= fhprice_end && jp_ca_item.Price >= fhprice_start && // 价格
        parseFloat(jp_ca_item.Disc) >= fh_dz_start && parseFloat(jp_ca_item.Disc) <= fh_dz_end && //打折
        (in_array(jp_ca_item.AirLine, fhgs) || fhgs.length == 0) //航空公司
        ?
        true : false;
      jp_ca_item.fh = allfh ? allfh : fh;
        // console.log(fhgs,fhcw,(in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0), "<舱位", fhprice_start + " < " + jp_ca_item.Price + " < " + fhprice_end, "<价格", fh_dz_start + " < " + jp_ca_item.Disc + " < " + fh_dz_end, "<打折", fh);

    });
    return list;
  }

  list.forEach(jp_item => {
    fh = false;
    //符合航空公司
    fh = in_array(jp_item.Airline, fhgs) || fhgs.length == 0 ? true : false;
    // console.log(jp_item.Airline, fhgs, fh, "<<<<<航空公司");
    if (fh) {
      jp_item.Cabins.forEach(jp_ca_item => {

        fh = (in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0) && // 舱位
          jp_ca_item.Price <= fhprice_end && jp_ca_item.Price >= fhprice_start && // 价格
          parseFloat(jp_ca_item.Disc) >= fh_dz_start && parseFloat(jp_ca_item.Disc) <= fh_dz_end //打折
          ?
          true : false;

        // console.log(fhgs,fhcw,(in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0), "<舱位", fhprice_start + " < " + jp_ca_item.Price + " < " + fhprice_end, "<价格", fh_dz_start + " < " + jp_ca_item.Disc + " < " + fh_dz_end, "<打折", fh);
      });
    }

    jp_item.fh = allfh ? allfh : fh;
  });

  return list;
}




// 废弃
// @param list 数据
// @param cityName 到达城市 必须 接口要的值 
export async function policy_make_one(list, cityName) {

  // TODO 飞机票政策
  let res_zc = await api.ajax("TrainPolicyList", {
    product_id: 1,
    user_id: "id" in userInfo_ && userInfo_.id,
    cityName: cityName
  });
  res_zc = res_zc.Result.result;

  // 如果没有政策全部显示符合
  let allfh = false;
  try {
    allfh = res_zc.length == 0 ? true : false;
  } catch (e) {
    allfh = false;
  }

  // console.log(res_zc);

  let fh = false; //是否符合
  let fhcw = []; //舱位
  let fhgs = []; //航空公司
  let fhprice_start = 0;
  let fhprice_end = 999999999;
  let fh_dz_start = 0;
  let fh_dz_end = 100;
  res_zc.forEach((zc_item, k) => {
    //舱位
    if (zc_item.fk_property_name == "aircabin") {
      fhcw = zc_item.policy_setting.map(cw => {
        return cw.realText;
      });
      //取价格政策
    } else if (zc_item.fk_property_name == "ticketprice") {
      if (zc_item.policy_setting.length > 1) {
        fhprice_start = parseFloat(zc_item.policy_setting[0].showText);
        fhprice_end = parseFloat(zc_item.policy_setting[1].showText);
      } else {
        fhprice_end = parseFloat(zc_item.policy_setting[0].showText);
      }
      //取打折政策
    } else if (zc_item.fk_property_name == "ticketprice") {
      if (zc_item.policy_setting.length > 1) {
        fh_dz_start = parseFloat(zc_item.policy_setting[0].showText) * 10;
        fh_dz_end = parseFloat(zc_item.policy_setting[1].showText) * 10;
      } else {
        fh_dz_end = parseFloat(zc_item.policy_setting[0].showText) * 10;
      }
    } else if (zc_item.fk_property_name == "aircommpany") {
      fhgs = zc_item.policy_setting.map(cw => {
        return cw.realText;
      });
    }
  });

  list.forEach(jp_ca_item => {

    fh = (in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0) && // 舱位
      jp_ca_item.Price <= fhprice_end && jp_ca_item.Price >= fhprice_start && // 价格
      parseFloat(jp_ca_item.Disc) >= fh_dz_start && parseFloat(jp_ca_item.Disc) <= fh_dz_end && //打折
      (in_array(jp_ca_item.AirLine, fhgs) || fhgs.length == 0) //航空公司
      ?
      true : false;

    jp_ca_item.fh = allfh ? allfh : fh;
  });



  // console.log(list, "<<<<<<<<<");

  return list;
}

// 废弃
export async function policy_make_old(list, params) {

  //兼容 老版
  let {endCity} = params; 
  let cityName = endCity;

  // TODO 飞机票政策
  let res_zc = await api.ajax("TrainPolicyList", {
    product_id: 1,
    user_id: "id" in userInfo_ && userInfo_.id,
    cityName: cityName
  });
  res_zc = res_zc.Result.result;

  // 如果没有政策全部显示符合
  let allfh = false;
  try {
    allfh = res_zc.length == 0 ? true : false;
  } catch (e) {
    allfh = false;
  }

  let fh = false; //是否符合
  let fhcw = []; //舱位
  let fhgs = []; //航空公司
  let fhprice_start = 0;
  let fhprice_end = 999999999;
  let fh_dz_start = 0;
  let fh_dz_end = 100;
  res_zc.forEach((zc_item, k) => {
    //舱位
    if (zc_item.fk_property_name == "aircabin") {
      fhcw = zc_item.policy_setting.map(cw => {
        return cw.realText;
      });
      //取价格政策
    } else if (zc_item.fk_property_name == "ticketprice") {
      if (zc_item.policy_setting.length > 1) {
        fhprice_start = parseFloat(zc_item.policy_setting[0].showText);
        fhprice_end = parseFloat(zc_item.policy_setting[1].showText);
      } else {
        fhprice_end = parseFloat(zc_item.policy_setting[0].showText);
      }
      //取打折政策
    } else if (zc_item.fk_property_name == "ticketprice") {
      if (zc_item.policy_setting.length > 1) {
        fh_dz_start = parseFloat(zc_item.policy_setting[0].showText) * 10;
        fh_dz_end = parseFloat(zc_item.policy_setting[1].showText) * 10;
      } else {
        fh_dz_end = parseFloat(zc_item.policy_setting[0].showText) * 10;
      }
    } else if (zc_item.fk_property_name == "aircommpany") {
      fhgs = zc_item.policy_setting.map(cw => {
        return cw.realText;
      });
    }

  });

  list.forEach(jp_item => {
    fh = false;
    //符合航空公司
    fh = in_array(jp_item.Airline, fhgs) || fhgs.length == 0 ? true : false;
    // console.log(jp_item.Airline, fhgs, fh, "<<<<<航空公司");
    if (fh) {
      jp_item.Cabins.forEach(jp_ca_item => {

        fh = (in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0) && // 舱位
          jp_ca_item.Price <= fhprice_end && jp_ca_item.Price >= fhprice_start && // 价格
          parseFloat(jp_ca_item.Disc) >= fh_dz_start && parseFloat(jp_ca_item.Disc) <= fh_dz_end //打折
          ?
          true : false;

        // console.log((in_array(jp_ca_item.ClassType, fhcw) || fhcw.length == 0), "<舱位", fhprice_start + " < " + jp_ca_item.Price + " < " + fhprice_end, "<价格", fh_dz_start + " < " + jp_ca_item.Disc + " < " + fh_dz_end, "<打折", fh);
      });
    }


    jp_item.fh = allfh ? allfh : fh;
  });

  return list;
}