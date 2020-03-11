import vs from "./base";

const common = {
  //定义转换函数
  dateConvert(dateParms)
  {
    // 对传入的时间参数进行判断
    if (dateParms instanceof Date)
    {
      var datetime = dateParms;
    }
    //判断是否为字符串
    if ((typeof dateParms == "string") && dateParms.constructor == String)
    {

      //将字符串日期转换为日期格式
      var datetime = new Date(Date.parse(dateParms.replace(/-/g, "/")));

    }
    //获取年月日时分秒
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minutes = datetime.getMinutes();
    var second = datetime.getSeconds();

    //月，日，时，分，秒 小于10时，补0
    if (month < 10)
    {
      month = "0" + month;
    }
    if (date < 10)
    {
      date = "0" + date;
    }
    if (hour < 10)
    {
      hour = "0" + hour;
    }
    if (minutes < 10)
    {
      minutes = "0" + minutes;
    }
    if (second < 10)
    {
      second = "0" + second;
    }

    //拼接日期格式【例如：yyyymmdd】
    var time = month + '月' + date + '日';

    //或者：其他格式等
    //var time = year+"年"+month+"月"+date+"日"+hour+":"+minutes+":"+second;

    //返回处理结果
    return time;
  },


  dateConvertWeek(formatStr)
  {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
  },

  ////获取当前时间，格式YYYY-MM-DD
  getNowFormatDate()
  {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9)
    {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9)
    {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  ////获取当前时间，格式YYYY-MM-DD
  getNowFormatDatePlusDay(day)
  {
    var date = new Date();

    date.setDate(date.getDate() + 1);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9)
    {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9)
    {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;


    return currentdate;
  },
  /**
   * 根据日期字符串获取星期几
   * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
   * @returns {String}
   */
  getWeek(dateString)
  {
    var date;

    var dateArray = dateString.split("-");
    date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);

    //var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
    //return "星期" + weeks[date.getDay()];
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },


  //求两个日期相差的天数
  getDays(strDateStart, strDateEnd)
  {
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
    return iDays;


  }
}

export default common;
