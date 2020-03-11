/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) 
        return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window
        .localStorage
        .setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) 
        return;
    return window
        .localStorage
        .getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) 
        return;
    window
        .localStorage
        .removeItem(name);
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    } else if (element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document
            .defaultView
            .getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return NumberMode == 'float'
        ? parseFloat(target)
        : parseInt(target);
}

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, el2,callback ) => {
    let windowHeight = window.screen.height;
    let height;
    let setTop;
    let paddingBottom;
    let marginBottom;
    let requestFram;
    let oldScrollTop;

    document
        .body
        .addEventListener('scroll', () => {
            loadMore();
        }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
    element.addEventListener('touchstart', () => {
        height = element.offsetHeight;
        setTop = element.offsetTop;
        paddingBottom = getStyle(element, 'paddingBottom');
        marginBottom = getStyle(element, 'marginBottom');
    }, {passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove', () => {
        loadMore();
    }, {passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend', () => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, {passive: true})

    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                loadMore();
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
                //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
                height = element.offsetHeight;
                loadMore();
            }
        })
    }

    const loadMore = () => {
        // if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom
        // + marginBottom) {
        if (el2.offsetHeight == height + element.scrollTop||el2.offsetHeight < height + element.scrollTop+100) {
            callback();
        }
    }
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll', () => {
        showBackFun();
    }, false)
    document.addEventListener('touchstart', () => {
        showBackFun();
    }, {passive: true})

    document.addEventListener('touchmove', () => {
        showBackFun();
    }, {passive: true})

    document.addEventListener('touchend', () => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, {passive: true})

    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
        if (document.body.scrollTop > 500) {
            console.log(1)
            callback(true);
        } else {
            console.log(2)
            callback(false);
        }
    }
}

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    } else if (duration instanceof String) {
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    const attrStyle = attr => {
        if (attr === "opacity") {
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    const rootSize = parseFloat(document.documentElement.style.fontSize);

    const unit = {};
    const initState = {};

    //获取目标属性单位和初始样式值
    Object
        .keys(target)
        .forEach(attr => {
            if (/[^\d^\.]+/gi.test(target[attr])) {
                unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
            } else {
                unit[attr] = 'px';
            }
            initState[attr] = attrStyle(attr);
        });

    //去掉传入的后缀单位
    Object
        .keys(target)
        .forEach(attr => {
            if (unit[attr] == 'rem') {
                target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
            } else {
                target[attr] = parseInt(target[attr]);
            }
        });

    let flag = true; //假设所有运动到达终点
    const remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
        Object
            .keys(target)
            .forEach(attr => {
                let iSpeed = 0; //步长
                let status = false; //是否仍需运动
                let iCurrent = attrStyle(attr) || 0; //当前元素属性址
                let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
                let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
                switch (mode) {
                    case 'ease-out':
                        speedBase = iCurrent;
                        intervalTime = duration * 5 / 400;
                        break;
                    case 'linear':
                        speedBase = initState[attr];
                        intervalTime = duration * 20 / 400;
                        break;
                    case 'ease-in':
                        let oldspeed = remberSpeed[attr] || 0;
                        iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
                        remberSpeed[attr] = iSpeed
                        break;
                    default:
                        speedBase = iCurrent;
                        intervalTime = duration * 5 / 400;
                }
                if (mode !== 'ease-in') {
                    iSpeed = (target[attr] - speedBase) / intervalTime;
                    iSpeed = iSpeed > 0
                        ? Math.ceil(iSpeed)
                        : Math.floor(iSpeed);
                }
                //判断是否达步长之内的误差距离，如果到达说明到达目标点
                switch (mode) {
                    case 'ease-out':
                        status = iCurrent != target[attr];
                        break;
                    case 'linear':
                        status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                        break;
                    case 'ease-in':
                        status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                        break;
                    default:
                        status = iCurrent != target[attr];
                }

                if (status) {
                    flag = false;
                    //opacity 和 scrollTop 需要特殊处理
                    if (attr === "opacity") {
                        element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                        element.style.opacity = (iCurrent + iSpeed) / 100;
                    } else if (attr === 'scrollTop') {
                        element.scrollTop = iCurrent + iSpeed;
                    } else {
                        element.style[attr] = iCurrent + iSpeed + 'px';
                    }
                } else {
                    flag = true;
                }

                if (flag) {
                    clearInterval(element.timer);
                    if (callback) {
                        callback();
                    }
                }
            })
    }, 20);
}
export function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function() {
        // 现在和上一次时间戳比较
        var last = +(new Date()) - timestamp;
        // 如果当前间隔时间少于设定时间且大于0就重新设置定时器
        if(last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            // 否则的话就是时间到了执行回调函数
            timeout = null;
            if(!immediate) {
                result = func.apply(context, args);
                if(!timeout) context = args = null;
            }
        }
    };
    return function() {
        context = this;
        args = arguments;
        // 获得时间戳
        timestamp = +(new Date());
        // 如果定时器不存在且立即执行函数
        var callNow = immediate && !timeout;
        // 如果定时器不存在就创建一个
        if(!timeout) timeout = setTimeout(later, wait);
        if(callNow) {
            // 如果需要立即执行函数的话 通过 apply 执行
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};

export const throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if(!options) options = {};
    // 定时器回调函数
    var later = function() {
        // 如果设置了 leading，就将 previous 设为 0
        // 用于下面函数的第一个 if 判断
        previous = options.leading === false ? 0 : +(new Date());
        // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
        timeout = null;
        result = func.apply(context, args);
        if(!timeout) context = args = null;
    };
    return function() {
        // 获得当前时间戳
        var now = +(new Date());
        // 首次进入前者肯定为 true
        // 如果需要第一次不执行函数
        // 就将上次时间戳设为当前的
        // 这样在接下来计算 remaining 的值时会大于0
        if(!previous && options.leading === false) previous = now;
        // 计算剩余时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 如果当前调用已经大于上次调用时间 + wait
        // 或者用户手动调了时间
        // 如果设置了 trailing，只会进入这个条件
        // 如果没有设置 leading，那么第一次会进入这个条件
        // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
        // 其实还是会进入的，因为定时器的延时
        // 并不是准确的时间，很可能你设置了2秒
        // 但是他需要2.2秒才触发，这时候就会进入这个条件
        if(remaining <= 0 || remaining > wait) {
            // 如果存在定时器就清理掉否则会调用二次回调
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if(!timeout) context = args = null;
        } else if(!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            // 没有的话就开启一个定时器
            // 并且不能不能同时设置 leading 和 trailing
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};