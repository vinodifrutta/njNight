if (!Array.prototype.forEach) {
	Array.prototype.forEach = function forEach(callback, thisArg) {
		var T, k;
		if (this == null) {
			throw new TypeError("this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}
		if (arguments.length > 1) {
			T = thisArg;
		}
		k = 0;
		while (k < len) {
			var kValue;
			if (k in O) {
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}

var commonTool = {};

commonTool.constants = {};

var _$c = commonTool.constants;
commonTool.uuid = function() {
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

commonTool.uuid12 = function() {
	return (S4() + S4() + S4());
}

commonTool.guid = function() {
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
			+ S4() + S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

commonTool.checkNotNull = function(data) {
	if (data == null || data == "" || data == "null")
		return false;
	return true;
}

function Rad(d) {
	return d * Math.PI / 180.0; // 经纬度转换成三角函数中度分表形式。
}

// 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度 返回数量级为m
commonTool.getBaiduMapDistance = function(lat1, lng1, lat2, lng2) {
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var b = Rad(lng1) - Rad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
			+ Math.cos(radLat1) * Math.cos(radLat2)
			* Math.pow(Math.sin(b / 2), 2)));
	s = s * 6370996.81; // 地球半径，千米;
	return s;
}

commonTool.getLatByLength = function(lat, length) {
	var s = length / 6370996.81;
	var a = Math.asin(Math.sqrt(Math.pow(Math.sin(s / 2), 2), 2)) * 2;
	var radLat1 = Rad(lat);
	var radLat2 = radLat1 + a;
	return radLat2 * 180.0 / Math.PI;
}

commonTool.getLngByLength = function(lat1, lng1, lat2, length) {
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var s = length / 6370996.81;
	b = 2 * Math.asin(Math.sqrt((Math.pow(Math.sin(s / 2), 2) - Math.pow(Math
			.sin(a / 2), 2))
			/ Math.cos(radLat1) / Math.cos(radLat2), 2));
	var lng2 = Rad(lng1) + b;
	return lng2 * 180.0 / Math.PI;
}

commonTool.isString = function(o) {
	return Object.prototype.toString.call(o) == "[object String]";
}

commonTool.isObject = function(o) {
	return Object.prototype.toString.call(o) == "[object Object]";
}

commonTool.isArray = function(o) {
	return Object.prototype.toString.call(o) == '[object Array]';
}

commonTool.isFunction = function(o) {
	return Object.prototype.toString.call(o) == '[object Function]';
}

commonTool.isEmpty = function(o) {
	if (typeof o == 'string') {
		if (o == undefined || o == '' || o == null || o == 'null') {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

commonTool.isNotEmpty = function(o) {
	if (typeof o == 'string') {
		if (o == undefined || o == '' || o == null || o == 'null') {
			return false;
		} else {
			return true;
		}
	}
	return true;
}

commonTool.checkEntCode = function(code) {
	var patrn = /^[0-9A-Z]+$/;
	if ((code.length != 18) || (patrn.test(code) == false)) {
		return false;
	} else {
		var Ancode;// 统一社会信用代码的每一个值
		var Ancodevalue;// 统一社会信用代码每一个值的权重
		var total = 0;
		var weightedfactors = [ 1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8,
				24, 10, 30, 28 ];// 加权因子
		var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
		// 不用I、O、S、V、Z
		for (var i = 0; i < code.length - 1; i++) {
			Ancode = code.substring(i, i + 1);
			Ancodevalue = str.indexOf(Ancode);
			total = total + Ancodevalue * weightedfactors[i];// 权重与加权因子相乘之和
		}
		var logiccheckcode = 31 - total % 31;
		if (logiccheckcode == 31)
			logiccheckcode = 0;
		var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
		var Array_Str = Str.split(',');
		logiccheckcode = Array_Str[logiccheckcode];
		var checkcode = code.substring(17, 18);
		if (logiccheckcode != checkcode)
			return false;
	}
	return true;
}

commonTool.changeEditToView = function() {
	$('select').attr("readonly", false);
	$('input').attr("readonly", false);
	$('textArea').attr("readonly", false);
	$('select').attr("disabled", true);
	$('input').attr("disabled", true);
	$('textArea').attr("disabled", true);
}

commonTool.bindInputChange = function(searchInput, func) {
	var flag = true;
	searchInput.bind('compositionstart', function() {
		flag = false;
	})
	searchInput.bind('compositionend', function() {
		flag = true;
	})
	searchInput.bind("input propertychange", function(event) {
		event = event || window.event;
		var jq = $(this);
		setTimeout(function() {
			if (event.ctrlKey == 1 && window.event.keyCode == 67) {
				return false;
			}
			if (event.ctrlKey == 1) {
				if (event.keyCode == 86 || event.keyCode) {
					if (typeof func == 'function')
						func(jq);
				}
			} else if (flag) {
				if (typeof func == 'function')
					func(jq);
			}
		}, 0);
	});
}

commonTool.cloneObj = function(obj) {
	var str, newobj = obj.constructor === Array ? [] : {};
	if (typeof obj !== 'object') {
		return;
	} else if (window.JSON) {
		str = JSON.stringify(obj), // 系列化对象
		newobj = JSON.parse(str); // 还原
	} else {
		for ( var i in obj) {
			newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
		}
	}
	return newobj;
};

// 动态加载js
commonTool.dynamicLoadJs = function(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	if (typeof (callback) == 'function') {
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === "loaded"
					|| this.readyState === "complete") {
				callback();
				script.onload = script.onreadystatechange = null;
			}
		};
	}
	head.appendChild(script);
}

commonTool.isNumber = function(val) {
	var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
	if (regPos.test(val) || regNeg.test(val)) {
		return true;
	} else {
		return false;
	}

}

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

function createUEEditor(id, data, basePath) {
	var editor = new baidu.editor.ui.Editor({
		initialContent : data,
		minFrameHeight : 200,
		imageUrl : basePath + 'resources/ueditor/jsp/imageUp.jsp',
		fileUrl : basePath + 'resources/ueditor/jsp/fileUp.jsp',
		wordImageUrl : basePath + 'resources/ueditor/jsp/imageUp.jsp',
		imageManagerUrl : basePath + 'resources/ueditor/jsp/imageManager.jsp',
		UEDITOR_HOME_URL : basePath + 'resources/ueditor/'
	});
	editor.render(id);
	return editor;
}

commonTool.getFixPosition = function(e) {
	var x = 0, y = 0;
	while (e != null) {
		x += e.offsetLeft;
		y += e.offsetTop;
		e = e.offsetParent;
	}
	return {
		x : x,
		y : y
	};
}

commonTool.getViewportSize = function(w) {
	var w = w || window;
	if (w.innerHeight != null) {
		return {
			w : w.innerWidth,
			h : w.innerHeight
		};
	}
	var d = w.document;
	if (document.compatMode == 'CSS1Compat') { // 标准模式
		return {
			width : d.documentElement.clientWidth,
			height : d.documentElement.clientHeight
		};
	}
	return {
		w : d.body.clientWidth,
		h : d.body.clientHeight
	};
}

function loadSimpleSelect(me) {
	var url = me.attr("url");
	var textField = me.attr("textField") || "text";
	var valueField = me.attr("valueField") || "value";
	var codeField = me.attr("codeField") || "code";
	var emptyText = me.attr("emptyText") || "";
	var val = me.val() || me.attr("value");
	me.empty();
	if (url) {
		$.ajax({
			url : url,
			type : "POST",
			success : function(datas) {
				datas = JSON.parse(datas);
				me.append($('<option value="">' + emptyText + '</option>'));
				for (var i = 0; i < datas.length; i++) {
					var _value = datas[i][valueField] || "";
					var _code = datas[i][codeField] || "";
					var _text = datas[i][textField] || "";
					var option = '<option value="' + _value + '" code="'
							+ _code + '">' + _text + '</option>';
					var selectOption = $(option);
					if (datas[i][valueField] == val)
						selectOption.attr("selected", true);
					me.append(selectOption);
				}

			},
			error : function(jqXHR, textStatus, errorThrown) {
			}
		});
	} else {
		me.append($('<option value="">' + emptyText + '</option>'));
	}

}

commonTool._toThousands = function(num) {
	var result = '';
	while (num.length > 3) {
		result = ',' + num.slice(-3) + result;
		num = num.slice(0, num.length - 3);
	}
	if (num) {
		result = num + result;
	}
	return result;
}

commonTool.toThousands = function(num) {
	var num = (parseFloat(num) || 0).toString();
	if (num.indexOf(".") > -1) {
		var t = num.split(".");
		return commonTool._toThousands(t[0]) + '.'
				+ commonTool._toThousands(t[1]);
	} else {
		return commonTool._toThousands(num);
	}
}

/**
 * 未考虑0值为轴的问题
 * splitNumber 3-6，分割数可能会+1
 */
commonTool.getYAsix = function(min, max, splitNumber,top) {
	top=top||0;//扩大系数，用于支持上方少量空白
	splitNumber=splitNumber||5;
	var splitList = [ 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100 ];
	var splitSize = (max - min) / (splitNumber)*(1+top);//分割大小。
	var zoom = Math.pow(10,Math.floor(Math.log10(splitSize) - 1));// 放大缩小系数
	var tempStep = parseFloat((splitSize / zoom).toFixed(6));
	var estep;// 期望得到的间隔
	for (var i = 0; i < splitList.length; i++) {
		if (splitList[i] >= tempStep) {
			estep = splitList[i] * zoom;
			break;
		}
	}
	var reMax, reMin;
	reMax = parseInt(max / estep + 1) * estep;// 向上取整
	if (max === 0) reMax = 0;
	if (min === 0) reMin = 0;
	if(reMax<max+0.3*estep) reMax+=(0.3-(reMax-max)/estep).toFixed(1)*estep;//上方留一点空白
	reMin=reMax-(splitNumber)*estep;
	if(reMin>min){
		return commonTool.getYAsix(min, max, splitNumber,top+0.1);
	}
	reMax =  parseFloat(reMax.toFixed(6));
	reMin = parseFloat(reMin.toFixed(6));
	var interval = parseFloat(((reMax - reMin) / splitNumber).toFixed(2));
	return {max:reMax,min:reMin,interval:interval};
}




_$c.reportCode = {
	QXYBB : 'QXYBB',// 重点流通企业月报表
	ZDBHDZBB : 'ZDBHDZBB',// 重点百货店周报表
	HJGRB : 'HJGRB',// 黄金周日报表
	BREPORTVEGET : 'BREPORTVEGET',// 时点菜价、粮价
	LAOZIJI : 'LAOZIJI'// 老字号季报
}

$(function() {
	// 自定义下拉框
	$('.simple-select').each(function(i) {
		var me = $(this);
		loadSimpleSelect(me);
	});
});
