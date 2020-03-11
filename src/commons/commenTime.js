import { MessageBox } from "mint-ui";
let result = null;
let date1 = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +23 * 60 * 60 * 1000
  ).getTime(); //new Date(new Date(new Date().toLocaleDateString()).getTime()+23*60*60*1000).getTime();
  let date2 = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +
      30 * 60 * 60 * 1000
  ).getTime();
let date3;
export function timeControl(callback) {
      window.tripg.paynew.getTime().then(res => {
        console.log(res);
        date3 = res * 1000;
    console.log("date1 :", date1);
      console.log("date2 :", date2);
      console.log("date3 :", date3);
        if (date3 >= date1 && date3 <= date2) {
           // result = true;
           
  
            MessageBox({
                    title: "",
                    message:
                      "火车票业务办理时间为23:00-06:00,若紧急出行请前往火车站窗口进行办理。",
                    confirmButtonText: "确定"
                    // cancelButtonText: "取消",
                    // showCancelButton: true
                  }).then(action => {
                console.log(action);
                if (action == "confirm") {
                return;
                }
            }).catch(err => {
                console.log(err);
            });
            return;
          } else{
            callback()
          }  
        });
       
  }
