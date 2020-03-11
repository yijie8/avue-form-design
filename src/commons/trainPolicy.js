
import { api } from 'tripg';
//火车票新政策
export async function  getTrainPolicy(programs_p,url,type){
    let obj = await api.ajax(url,programs_p);
    console.log('objsdf :', obj);
    let result;
    switch (type) {
        case 1: //判断符合不符合
            result = {
            //   trainType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.PolicyList[0].TrainList_type:'',
            //   seatType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.PolicyList[0].TrainList_seat:'',
            // trainType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.PolicyList:'',
            // seatType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.PolicyList:'',
             trainType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.TrainList_type_z:'',
            seatType: obj.Result.Policy_List.PolicyList? obj.Result.Policy_List.TrainList_seat_z:'',
            /*
              trainType: obj.Result.Policy_List.PolicyList[0].TrainList_9?
                        obj.Result.Policy_List.PolicyList[0].TrainList_9 : obj.Result.Policy_List.PolicyList[0].TrainList_type,
              seatType: obj.Result.Policy_List.PolicyList[0].TrainList_10?
                        obj.Result.Policy_List.PolicyList[0].TrainList_10 : obj.Result.Policy_List.PolicyList[0].TrainList_seat,
              */
            }
            break;
        case 2: //判断是否可以继续预定
            result = obj.Result.Policy_P?obj.Result.Policy_P:''
            break;
        default:
            break;
    }
    return result
   
  }