import { Col } from "element-ui";

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function Trim(str, is_global='') {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}

export function addClass(el, className) {
  console.log(el)
  console.log(className)
  if (hasClass(el, className)) {
    return
  }

  let newClass = el
    .className
    .split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return
  }

  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el
    .className
    .replace(reg, ' ')
}

export function getData(el, name, val) {
  let prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {top: rect.top, left: rect.left, width: rect.width, height: rect.height}
  } else {
    return {top: el.offsetTop, left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight}
  }
}
export function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2002-12-18格式
  var aDate,
    oDate1,
    oDate2,
    iDays
  aDate = sDate1.split("-")
  oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]) //转换为12-18-2002格式
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
  return iDays
}
// 返回数组索引 适用于唯一ID标识
export function findIndex(arr, dst) {
  var i = arr.length;
  while (i -= 1) {
    if (arr[i] == dst) {
      return i;
    }
  }
  return false;
}
export function TimeStream(timestamp, type) {
  let date = new Date(timestamp * 1000);
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1);
  let D = date.getDate() < 10
    ? '0' + date.getDate()
    : date.getDate();
  let h = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours();
  let m = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes();
  let s = date.getSeconds() < 10
  ? '0' + date.getSeconds()
  : date.getSeconds();

  switch (type) {
    case 'YMD': //年-月-日
      return Y + '-' + M + '-' + D;
    case 'MD': //月-日
      return M + '-' + D;
    case 'MD_HM': //月-日
      return M + '-' + D + ' ' + h + ':' + m;
    case 'YMD_HMS': // 月-日 时：分：秒
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    case 'CN_YMD': //x年x月x日
      return Y + '年' + M + '月' + D + '日';
    case 'CN_YMD_HM': //x年x月x日
      return Y + '年' + M + '月' + D + '日 ' + h + ':' + m;
    case 'hm': // 时:分
      return h + ':' + m;
    case '-D': //天数差
      return Math.floor(((timestamp * 1000) - Date.parse(new Date())) / 1000 / 3600 / 24);
    case '-H': //小时差
      return Math.ceil((timestamp * 1000 - Date.parse(new Date())) / 1000 / 3600);
    case '-M': //分钟差
      return Math.floor((timestamp * 1000 - Date.parse(new Date())) / 1000 / 60);
    case '-S': //秒差
      return Math.floor((timestamp * 1000 - Date.parse(new Date())) / 1000);
    default: //年-月-日 时:分
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
  }
}
export function TimeStream2(timestamp, type) {
  var date1 = new Date(timestamp * 1000);
  var date2 = new Date(); //结束时间
  var date3 = date2.getTime() - new Date(date1).getTime(); //时间差的毫秒数
  //------------------------------ 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000))

  //计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  return p(minutes.toString().replace("-", "")) + "分" + p(seconds.toString().replace("-", "")) + "秒";
}
export function p(s) {
  return s < 10
    ? '0' + s
    : s;
}
export function isPc() {
  var ua = navigator.userAgent;
  if ((ua.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))) {
    return false
  } else {
    return true
  }
}
// export function isIos() {
//   var ua = navigator.userAgent;
//   if ((ua.match(/(Android|webOS|Safari|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))) {
//     if (/iPhone|iPad|iPod|Safari/.test(ua)) {
//       console.log('ios')
//       return true
//     } else if (/Android/.test(ua)) {
//       console.log('Android')
//       return false
//     }
//   }
// }
export function isIos() {
  var ua = navigator.userAgent;
  // if ((ua.match(/(Android|webOS|Safari|iPhone|iPad|iPod|BlackBerry|Windows
  // Phone)/i))) {
  console.log(ua);
  if (/iPhone|iPad|iPod|Mac OS X/.test(ua)) {
    console.log('ios')
    return true
  } else {
    console.log('Android | 谷歌')
    return false
  }
  // }
}
// export function isIos() {
//   return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
// }
export function getItemObj(key) {
  if (key == null || key == undefined) {
    return
  }
  return JSON.parse(localStorage.getItem(key))
}
// 获取几天后日期，num类型 默认明天
export function GetDateStr(type = 'en', AddDayCount = 1) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  switch (type) {
    case 'en':
      return y + "-" + m + "-" + d;
      break;
    case 'normal':
      return y + "年" + m + "月" + d + "日";
      break;
    case 'common':
      return y + "/" + m + "/" + d;
      break;
    default:
      break;
  }
}

// 获取传入的dates的几天后日期，num类型 默认明天
export function GetDatesStr(dates,type = 'en', AddDayCount = 1) {
  console.log(dates,type,AddDayCount)
  if(dates.indexOf('-')>0){
    dates = dates.replace(/-/g,'/');
  }
  var dd = new Date(dates);
  
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
  switch (type) {
    case 'en':
      return y + "-" + m + "-" + d;
      break;
    case 'normal':
      return y + "年" + m + "月" + d + "日";
      break;
    case 'common':
      return y + "/" + m + "/" + d;
      break;
    default:
      break;
  }
}
// 订单详情页面专用，酒店日期显示，获取传入的dates的几天后日期，num类型 默认明天
export function GetDatesStr1(dates,type = 'en', AddDayCount = 1) {
  console.log(dates,type,AddDayCount)
  // if(dates.indexOf('-')>0){
  //   dates = dates.replace(/-/g,'/');
  // }
  var dd = new Date(dates);
  
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "/" + m + "/" + d;
  switch (type) {
    case 'en':
      return y + "-" + m + "-" + d;
      break;
    case 'normal':
      return y + "年" + m + "月" + d + "日";
      break;
    case 'common':
      return y + "/" + m + "/" + d;
      break;
    default:
      break;
  }
}
//lxn日期之后的几天
export function GetDatesStr2(dates, AddDayCount) {
  // if(dates.indexOf('-')>0){
  //   dates = dates.replace(/-/g,'/');
  // }
  var dd = new Date(dates);
  let dc = dd.getTime()+AddDayCount*24*60*60*1000
  let date = new Date(dc)
  let Y = date.getFullYear();
  let    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  let     D = date.getDate();
  return Y + "/" + M + "/" + D;

}
export function getMonth(timestamp) {
  let date = new Date(timestamp);
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1);
  let D = date.getDate() < 10
    ? '0' + date.getDate()
    : date.getDate();

  return M + '月' + D + "日";
}
/**lxn新加 */
export function getYears(timestamp) {
  let date = new Date(timestamp);
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1);
  let D = date.getDate() < 10
    ? '0' + date.getDate()
    : date.getDate();

  return Y + '-' + M + '-' + D ;
}
export function newTimeStream(timestamp,serverTime, type) {
  let serverTime_ =  new Date(serverTime * 1000);
  let date = new Date(timestamp * 1000);
  
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1);
  let D = date.getDate() < 10
    ? '0' + date.getDate()
    : date.getDate();
  let h = date.getHours() < 10
    ? '0' + date.getHours()
    : date.getHours();
  let m = date.getMinutes() < 10
    ? '0' + date.getMinutes()
    : date.getMinutes();
  let s = date.getSeconds() < 10
  ? '0' + date.getSeconds()
  : date.getSeconds();

  switch (type) {
    case 'YMD': //年-月-日
      return Y + '-' + M + '-' + D;
    case 'MD': //月-日
      return M + '-' + D;
    case 'MD_HM': //月-日
      return M + '-' + D + ' ' + h + ':' + m;
    case 'YMD_HMS': // 月-日 时：分：秒
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    case 'CN_YMD': //x年x月x日
      return Y + '年' + M + '月' + D + '日';
    case 'CN_YMD_HM': //x年x月x日
      return Y + '年' + M + '月' + D + '日 ' + h + ':' + m;
    case 'hm': // 时:分
      return h + ':' + m;
    case '-D': //天数差
      return Math.floor(((timestamp * 1000) - Date.parse(serverTime_)) / 1000 / 3600 / 24);
    case '-H': //小时差
      return Math.ceil((timestamp * 1000 - Date.parse(serverTime_)) / 1000 / 3600);
    case '-M': //分钟差
      return Math.floor((timestamp * 1000 - Date.parse(serverTime_)) / 1000 / 60);
    case '-S': //秒差
      return Math.floor((timestamp * 1000 - Date.parse(serverTime_)) / 1000);
    default: //年-月-日 时:分
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
  }
}