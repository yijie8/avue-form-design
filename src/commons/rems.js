//webview 有时候部位机型fontSize错误，因为app篡改fontSize根本值，以下方法为解决方式（未证实）
//也可以安卓端工程师webview配置webview.getSettings().setTextZoom(100)就可以禁止缩放，按照百分百显示。（首选）
//function htmlFontSize() {
//	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//	var width = w > h ? h : w;
//	width = width > 720 ? 720 : width
//	var fz = ~~(width * 100000 / 36) / 10000
//	document.getElementsByTagName("html")[0].style.cssText = 'font-size: ' + fz + "px";
//	var realfz = ~~(+window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.replace('px', '') * 10000) / 10000
//	if(fz !== realfz) {
//		document.getElementsByTagName("html")[0].style.cssText = 'font-size: ' + fz * (fz / realfz) + "px";
//	}
//}
//htmlFontSize()
(function(doc, win) {
	var docEl = doc.documentElement,
	  resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
	  recalc = function() {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		if (clientWidth == 375) {
		  docEl.style.fontSize = "100px";
		} else {
		  docEl.style.fontSize = 100 * (clientWidth / 375) + "px";
		  if (clientWidth > 600) {
			docEl.style.fontSize = "100px";
		  }
		}
	  };
  
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener("DOMContentLoaded", recalc, false);
  })(document, window);
  