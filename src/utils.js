export function sleep(s){
  s = s || 0;
  s  = parseInt(s) * 1000;
  let now = +new Date();
  let timer = null;
  return new Promise((resolve, reject)=>{
      timer = setInterval(()=>{
          if( now + s < +new Date()){
              clearInterval(timer);
              resolve(true);
          }
      }, 10)
  })
}

/**
 * t 秒数
 * do 判断的条件
 */
export async function sleepdo(t,dox){
  let z= t ? t/0.1 : 10;
  let c=1;
  while(!dox && c<=z) {
    await sleep(0.1);
    c++;
  }
}