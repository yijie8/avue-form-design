 /*获取token接口*/

import vs from './base.js';
import axios from 'axios';


 let getToken = function(token,val)
 {

   var self = this;
  //  let token = vs.getQueryString('token');
  
    localStorage.removeItem('userInfo');
    setTimeout(()=>{
      let data = vs.getQueryString('data');
    },1000)
 
  //  localStorage.removeItem('userInfo');
   let data = vs.getQueryString('data');

  console.log('token111111111111 :', token);

   if ('' != token)
   {

     var url = 'https://dev.tripg.com/service/sso/GetUserForH5.aspx?token=' + token
     console.log('请求URL' + url)
     
     axios.get(url)
       .then(function (response)
       {

         let Code = response.data.Code;
         
         if (Code == 200)
         {
          
          vs.setItem("userInfo", response.data.Result);
          localStorage.setItem('noExistenceToken',0);
          vs.setItem("robInfo", data);
          vs.setItem("isFirst", 1);
          setTimeout(()=>{
            location='/tripTrain/tmcTicketRob/'+localStorage.getItem("lang")//TicketRob_tieyou///tmcTicketRob
          },1000)
         
         /*  if(val){
            switch (val) {
              case 'hotel':
                location='/tripHotel/'+localStorage.getItem("lang");
                break;
              case 'plane':
                location='/tripPlane/'+localStorage.getItem("lang");
                break;
              case 'car':
                location='/tripCar/'+localStorage.getItem("lang");
                break;
              case 'order':
                location='/me/meOrder/'+localStorage.getItem("lang")+'?noExistenceToken=0';
                break;
              case 'train_rob': 
                
                break;
              default:  
              location='/TicketRob_tieyou/'+localStorage.getItem("lang")
                break;

            }
          }*/
           //self.userName= vs.getItem("userInfo") ? (vs.getItem("userInfo").lastname + vs.getItem("userInfo").firstname) : '金卯刀';

         }
         else
         {
        
           setTimeout(function ()
           {
            location='/'+localStorage.getItem("lang");
           }, 500)
         }
       })
       .catch(function (error)
       {
         //console.log(error)
        //  vs.toast(self.$t('commons.token_no'))
        //  setTimeout(function ()
        //  {
        //    self.$router.replace({
        //      name: 'init'
        //    })
        //  }, 500)
       });
   }
 }

 export default getToken;
