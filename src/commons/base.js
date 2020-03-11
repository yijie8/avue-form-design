const vs = {
  getItem:function(key){
    return JSON.parse(localStorage.getItem(key));
  },
  setItem(key,val,callback){
    localStorage.setItem(key,JSON.stringify(val));
    if(callback)
      callback()
  },
  global:{
    searchCityData:''
  },
  dateComParam(dateTime){   //选中日期是星期几，两个日期间隔几天
      let returnObj = {};
      returnObj.todayStyle = [];
      returnObj.defaultDay = [];
      dateTime = dateTime.split("+");
      let arr = ["今天","明天","后天"];
      let week = this.getDayTime(dateTime[0]);
      let toDate = this.getDateDay(0,"","normal");
      let dateLength = this.getDateDiff(toDate,dateTime[0]);
      if(dateTime.length == 1){
        returnObj.todayStyle.push(this.getDateDay(dateLength,"M")+"月"+this.getDateDay(dateLength,"D")+"日");
        if(dateLength <= arr.length - 1){
          week = arr[dateLength];
        }
        returnObj.defaultDay.push(week)
      }else{
        let dateLength2 = this.getDateDiff(dateTime[0],dateTime[1]);
        for(let i = 0 ; i < dateTime.length ; i++){
          dateLength = this.getDateDiff(toDate,dateTime[i]);
          if(dateLength <= arr.length - 1){
            week = arr[dateLength];
          } else{
            week = this.getDayTime(dateTime[i]);
          }
          returnObj.defaultDay.push(week)
          returnObj.todayStyle.push(this.getDateDay(dateLength,"M")+"月"+this.getDateDay(dateLength,"D")+"日");
        }
        returnObj.dateLength = dateLength2 + 1;
      }
      return returnObj;
    },
  getDayTime:function(time){  //返回星期几
    time = time.replace(/-/g,",")
    let date = new Date(time);
    let w = "日一二三四五六".charAt(date.getDay());
    let week= "星期"+w
    return week;
  },
  getDateDiff:function(startDate,endDate){  //间隔天数
      var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
      var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
      var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
      return dates;
  },
  getQueryString(name) {


    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
      return '';
    }

    // 获取链接中参数部分
    var queryString = location.href.substring(location.href.indexOf("?") + 1);
    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
      // 获取等号位置
      pos = parameters[i].indexOf('=');
      if (pos == -1) {
        continue;
      }
      // 获取name 和 value
      paraName = parameters[i].substring(0, pos);
      paraValue = parameters[i].substring(pos + 1);
      // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
      if (paraName == name) {
        let str = decodeURI(paraValue);
        return  str.replace(/\+/g, " "); //escape(paraValue.replace(/\+/g, " "));
      }
    }
    return '';
  },



  getDateDay:function(AddDayCount,type = "",normal="") {   //返回年月日、日、月、年
    let dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);
    let y = dd.getFullYear();
    let m = dd.getMonth()+1;
    let d = dd.getDate();
    let returnStr;
    switch(type){
      case "Y":
        returnStr = y
        break;
      case "M":
        returnStr = m
        break;
      case "D":
        returnStr = d
        break;
    }
    if(normal)
      return y+"-"+m+"-"+d;
    else
      return returnStr;
  }, 
  demoArrTimeFilter:function(){
    return {
      "不限":"",
      "上午06:00-11:59":"0600-1159",
      "中午12:00-12:59":"1200-1259",
      "下午13:00-17:59":"1300-1759",
      "晚上18:00-23:59":"1800-2359"
    } 
  },
  createComparisonFunction:function (propertyName,sortType) { 
    return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if(value1 < value2) {
      return -1*sortType;
    } else if(value1 > value2) {
      return 1*sortType;
    } else {
      return 0; 
    }
    };
  }

} 
Array.prototype.unique = function(){
  var res = [];
  var json = {};
  for(var i = 0; i < this.length; i++){
   if(!json[this[i]]){
    res.push(this[i]);
    json[this[i]] = 1;
   }
  }
  return res;
 } 
String.prototype.replaceAll = function(s1,s2){ 
  return this.replace(new RegExp(s1,"gm"),s2); 
}



export default vs;
