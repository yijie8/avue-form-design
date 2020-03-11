import axios from "axios";
import md5 from "./md5.js";
axios.defaults.baseURL = "https://dev.tripg.com/h/";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let user_code = '';
if (!!localStorage.getItem('userInfo')) {
    user_code = JSON.parse(localStorage.getItem('userInfo')).user_code
}


let err_text = localStorage.getItem('lang') == "zh" ?
    "当前查询人数过多，请稍后刷新再试" :
    'There are too many queries currently, please refresh again and try again.'

let me = this;
// axios.defaults.timeout = 2000;
const signKey = {
    _sign: '1523237670977',
    _key: '285e3bb3df2e43d9b5745e44f7871868',
    _debugging: 0
}

const paramLogic = {

    paramsData(parmData) {
        var s = [];

        function add(key, value) {
            s[s.length] = key + "=" + value;
        };

        for (let prefix in parmData) {

            add(prefix, parmData[prefix]);

        }
        return s.join("&");
    }


}

const $ajax = function(param, funObj, _T = +new Date()) {
    let _version_ = funObj._version_ ? funObj._version_ : '1.0';
    let _debugging = funObj._debugging ? funObj._debugging : signKey._debugging;
    let _token = "",
        data;
    if (funObj._S == 1 && funObj.rcp == undefined) {
        let paramlength = -1,
            arrRandom = [];
        for (let key in param) {
            arrRandom.push(key);
            paramlength++;
        }
        let random = parseInt(Math.random() * (paramlength + 1), 10);
        for (let key in param) {
            if (key == arrRandom[random]) {

                _token = md5.MD5(JSON.stringify(param[key]) + key + _T + signKey._key).toString();
                break;
            }
        }
        data = {
            ...param,
            _S: funObj._S,
            _T,
            _P: arrRandom[random],
            _token,
            _sign: signKey._sign,
            _debugging: _debugging,
            _tag_: funObj.url,
            _device: 'h5' + '|' + user_code,
            _version_
        }
    } else if (funObj._S == 1 && funObj.rcp != undefined) {
        let sa = funObj.rcp.split(",");
        let darg = "";
        for (let i = 0; i < sa.length; i++) {
            if (typeof param[sa[i]] == "object")
                darg += JSON.stringify(param[sa[i]]);
            else
                darg += param[sa[i]];
        }
        darg += funObj.rcp + _T + signKey._key;

        _token = md5.MD5(darg).toString();
        data = {
            ...param,
            _S: funObj._S,
            _T,
            _P: funObj.rcp,
            _token,
            _sign: signKey._sign,
            _debugging: _debugging,
            _tag_: funObj.url,
            _device: 'h5' + '|' + user_code,
            _version_
        }
    } else {
        data = {
            ...param,
            _S: funObj._S,
            _T,
            _P: "",
            _sign: signKey._sign,
            _token,
            _debugging: _debugging,
            _tag_: funObj.url,
            _device: 'h5' + '|' + user_code,
            _version_
        }
    }


    // console.log("接口调用:"+axios.defaults.baseURL + "?" + paramLogic.paramsData(data))

    let res = {}; //给PHP服务器用
    axios({
            method: funObj.method,
            url: "/",
            data
        })
        .then(function(responseRes) {
            res = responseRes; //给PHP服务器用
            if (funObj.complete)
                funObj.complete(responseRes.data);
            if (responseRes.data.Code == 200) {
                if (funObj.success)
                    funObj.success(responseRes.data.Result);
            } else {
                if (funObj.error)
                    funObj.error(responseRes.data);
            }
        })
        .catch(function(error) {
            console.log('error ==================>:', error);

            //此处将错误上传到PHP服务器记录下来
            //查看地址：https://www.tripglobal.cn/fx/index.php?s=index/log/get
            axios({
                    method: 'post',
                    url: 'https://www.tripglobal.cn/fx/index.php?s=index/log/index',
                    data: {
                        'url': "_tag_" in data ? data["_tag_"] : "",
                        'er': "" + error,
                        'pa': JSON.stringify(data),
                        're': JSON.stringify(res),
                        'code': "" + funObj.success,
                    }
                })
                //end 
            return;
            if (funObj.error) {
                error = {
                    Message: err_text
                };
                funObj.error(error);
                setTimeout(() => {
                    var ua = window.navigator.userAgent;
                    if (ua.match(/tripgios/i) == "tripgios") {
                        window.webkit.messageHandlers.popToIndex.postMessage("parameter");
                    } else if (ua.match(/tripgandroid/i) == "tripgandroid") {
                        let param_ = {
                            routerName: 'home'
                        };
                        window.tripgapp.activity(JSON.stringify(param_));

                    } else {
                        window.location.href = "/";
                    }
                }, 1000)


            }
        });

};



export default $ajax