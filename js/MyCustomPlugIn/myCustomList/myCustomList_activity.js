/**
 * 自定义分页控件JS ( 基于JQuery )
 * author:HuangDong
 */

/**
 * 注入自定义分页条CSS
 * @param js
 * @returns {String}
 */
__CreateJSPath = function (js) {
	var scripts = document.getElementsByTagName("script");
	var path = "";
	for (var i = 0, l = scripts.length; i < l; i++) {
		var src = scripts[i].src;
		if (src.indexOf(js) != -1) {
			var ss = src.split(js);
			path = ss[0];
			break;
		}
	}
	var href = location.href;
	href = href.split("#")[0];
	href = href.split("?")[0];
	var ss = href.split("/");
	ss.length = ss.length - 1;
	href = ss.join("/");
	if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
		path = href + "/" + path;
	}
	return path;
}

var bootPATH = __CreateJSPath("myCustomList_activity.js");
document.write('<link href="' + bootPATH + 'myCustomList.css?v=2" rel="stylesheet" type="text/css" />');



/**
 * 基于JQuery的分页插件(模拟MINIUI)
 * @param id:列表的ID
 * @param paramMap:自定义参数
 *
 *  调用方法：__________________________________________________________________________
 *  HTML示例：
 *  <div id="dataList" pageSize="5" url="queryBus/dotListJson?" >
 *  	<div>
 *  		<div>{name}</div> <div>{email}</div>
 *  	</div>
 *  </div>
 *
 *  JS示例: $("#dataList").myLoad();
 *  ——————————————————————————————————————————————————————————————————————————————————
 *
 * 要求后台返回的分页数据格式为JSON字符串：________________________________________________
 * 示例:
 * {
 * 	 "datalist"   : [{"name":"111" , "email":"AAA"} , {"name":"222" , "email":"BBB"}] ,
 * 	 "totalCount" : "100" ,
 *   "totalPage"  : "10"  ,
 *   "pageIndex"  : "0"   ,
 *   "pagesize"   : "10"  ,
 * }
 * 说明:
 * 	datalist   : 列表数据List
 *  totalCount : 总记录数
 *  totalPage  : 总页数
 *  pageIndex  : 页码(从0开始)
 *  pagesize   : 每页记录数
 *  ___________________________________________________________________________________
 *
 */

/**
 * 分页列表参数暂存Map
 * 格式： { "列表1的id" : "列表1的参数Map" , "列表1的id" : "列表1的参数Map" }
 */
var paramMapCache = {};

/**
 * (主方法1)传入paramMap加载列表(若不传入从缓存取)
 * 重置分页参数(pageIndex)
 * 此方法用于：第一次加载列表、查询加载列表，本质上都是第一次加载列表，所以要强制清空列表再加载
 */
$.fn.myLoad = function (paramMap) {
	var id = $(this).attr("id");
	var Obj = $("#" + id);

	Obj.attr("pageIndex", "0");//重置分页参数(pageIndex)

	var isClean = Obj.attr("isClean");//先获取isClean配置
	Obj.attr("isClean", "true");//强制置为true以便清空列表
	Obj.myReLoad(paramMap);//加载列表
	Obj.attr("isClean", isClean);//加载完后isClean置为先前的值
};
/**
 * (主方法2)传入paramMap加载列表(若不传入从缓存取)
 * 保留分页参数(pageIndex)
 * 本方法用于：上一页、下一页、前往第几页、删除记录后的当前页刷新(例如在第2页删除了一条记录，刷新也要保持在第2页)，所有此方法保留分页参数pageIndex
 */
$.fn.myReLoad = function (paramMap) {
	var id = $(this).attr("id");
	var Obj = $("#" + id);

	//从缓存取参数(上一页，下一页，前往第几页没有带参数，需要从缓存取)
	if (paramMap == null || paramMap == {} || myCustomList.isEmptyMap(paramMap)) {
		paramMap = paramMapCache[id] == null ? {} : paramMapCache[id];
	}

	//加载列表
	myCustomList.load(id, paramMap);

	//暂存参数缓存
	paramMapCache[id] = paramMap;
};

/**
 * 手动增加数据行
 * @param 例如：[{"id":"111" , "name":"AAA"} , {"id":"222" , "name":"BBB"}]
 */
$.fn.addRows = function (datalist) {
	var id = $(this).attr("id");
	myCustomList.addRows(id, datalist);
};

/**
 * 手动删除数据行
 * @param 例如：[{"id":"111" , "name":"AAA"} , {"id":"222" , "name":"BBB"}]
 * 调用此方法前先调用 getSelects()方法获取selects数组
 */
$.fn.deleteRows = function (selects) {
	var id = $(this).attr("id");
	myCustomList.deleteRows(id, selects);
};
/**
 * 手动删除数据行(根据 _row_id)
 * @param 例如：[{"id":"111" , "name":"AAA"} , {"id":"222" , "name":"BBB"}]
 * 调用此方法前先调用 getSelects()方法获取selects数组
 */
$.fn.deleteRowsBy_row_id = function (_row_id) {
	var id = $(this).attr("id");
	myCustomList.deleteRowsBy_row_id(id, _row_id);
};

/**
 *  获取选择数据行
 *  @return 例如：[{"id":"111" , "name":"AAA"} , {"id":"222" , "name":"BBB"}]
 */
$.fn.getSelects = function () {
	var id = $(this).attr("id");
	return myCustomList.getSelects(id);
};

/**
 *  获取选择数据行(根据 _row_id)
 *  @return 例如：[{"id":"111" , "name":"AAA"}]
 */
$.fn.getRowBy_row_id = function (_row_id) {
	var id = $(this).attr("id");
	return myCustomList.getRowBy_row_id(id, _row_id);
};

/**
 *  获取当前页所有数据行
 *  @return 例如：[{"id":"111" , "name":"AAA"} , {"id":"222" , "name":"BBB"}]
 */
$.fn.getDatas = function () {
	var id = $(this).attr("id");
	return myCustomList.getDatas(id);
};

/**
 * 实现方法
 * @method load    : 加载列表
 * @method lastPage: 上一页
 * @method nextPage: 下一页
 * @method gotoPage: 前往第几页
 */
var myCustomList = {
	//加载列表
	load: function (id, paramMap) {

		layerUtils.loading('加载中');

		var Obj = $("#" + id);

		//是否初始化列表
		var init = Obj.attr("init");
		if (myCustomList.isUndefined(init)) {
			init = true;
			Obj.attr("init", "false");
		}

		//获取pageIndex
		var pageIndex = Obj.attr("pageIndex");
		if (myCustomList.isUndefined(pageIndex)) {
			pageIndex = 0;
			Obj.attr("pageIndex", "0");
		}

		//获取pageSize
		//可配置参数,必填
		var pageSize = Obj.attr("pageSize");

		//获取URL
		//可配置参数,必填
		var url = Obj.attr("url");

		//获取数据行模板
		var lineHtml = Obj.attr("lineHtml");
		if (myCustomList.isUndefined(lineHtml)) {
			lineHtml = Obj.children().eq(0).prop("outerHTML");
			lineHtml = lineHtml.replace("display:none", "");
			Obj.attr("lineHtml", lineHtml);
		}

		//分页模式:
		//可配置参数(pc/mobile),选填，缺省pc
		var pagingMode = Obj.attr("pagingMode");
		if (myCustomList.isUndefined(pagingMode)) {
			pagingMode = "pc";
			Obj.attr("pagingMode", pagingMode);
		}

		//获取loadAll
		var loadAll = Obj.attr("loadAll");
		if (myCustomList.isUndefined(loadAll)) {
			loadAll = "false";
			Obj.attr("loadAll", "false");
		}

		//渲染分页条
		if ((init == true || init == "true") && loadAll == "false") {
			var pagerHtmlTmp = pagerHtml;
			if (pagingMode == "mobile") {//mobile模式下绑定滑动到底事件
				var pagerHtmlTmp = pagerHtml_mobile;
				$("#" + id).parent().scroll(function () {
					var obj_height = $("#" + id).height() + 40;//列表本身高度（数据越来越多，高度随之越来越高）
					var parent_scroll_height = $("#" + id).parent().height() + $("#" + id).parent().scrollTop();//列表父元素固定高度 + 列表父元素滚动距离
					if (parent_scroll_height <= (obj_height + 20) && parent_scroll_height >= (obj_height - 20) && $("#noMoreDiv" + id).css("displsy") != "none") {
						myCustomList.nextPage(id);
					}
				});
			}
			pagerHtmlTmp = pagerHtmlTmp.replace(eval('/{id}/g'), id);
			Obj.after(pagerHtmlTmp);
		}

		//添加表头表体同步滚动事件
		Obj.scroll(function (ev) {
			$(this).parent().children().eq(0).scrollLeft($(this).scrollLeft()); // 横向滚动条
		});

		//是否清除上一页数据
		//可配置参数(true/false),选填，缺省true
		var isClean = Obj.attr("isClean");
		if (myCustomList.isUndefined(isClean)) {
			isClean = "true";
			Obj.attr("isClean", isClean);
		}

		//拼接参数
		var postParam = { pageIndex: pageIndex, pageSize: pageSize, loadAll: loadAll };
		for (var postKey in paramMap) {//自定义参数
			var postValue = paramMap[postKey];
			postParam[postKey] = postValue;
		}
		console.log(url);
		//请求后台
		$.ajax({
			url: url,
			type: 'GET',
			data: postParam,
			success: function (data) {
				//var dataJson = eval('(' + data + ')');//JSON.parse(data)
				console.log("data", data);
				var dataJson = typeof data == 'string' ? eval('(' + data + ')') : data;
				console.log("dataJson", dataJson);

				var type = postParam.type;
				var state = postParam.state;
				var adminDiv = postParam.adminDiv;
				console.log("type", type);
				console.log("state", state);
				console.log("adminDiv", adminDiv);

				var datalist_tmp = dataJson["datalist"];
				console.log("datalist_tmp", datalist_tmp);
				var datalist = [];
				for (var i = 0; i < datalist_tmp.length; i++) {

					if (
						(type == '' || type == null || type == undefined || type == datalist_tmp[i]["type"])
						&&
						(state == '' || state == null || state == undefined || state == datalist_tmp[i]["state"])
						&&
						(adminDiv == '' || adminDiv == null || adminDiv == undefined || (datalist_tmp[i]["adminDiv"]).indexOf(adminDiv) > -1)
					) {
						datalist.push(datalist_tmp[i]);
					}
				}
				var nowTime = new Date(dateFormat(new Date(), 'yyyy-mm-dd')).getTime();
				console.log("datalist", datalist);
				var state0 = [];
				var state1 = [];
				var state2 = [];
				datalist.forEach(e => {
					var startTime = new Date(e.startDate).getTime();
					var endTime = new Date(e.endDate).getTime();
					if (nowTime < startTime) {
						e.state = '1';
						state1.push(e);
					} else if (nowTime > endTime) {
						e.state = '2';
						state2.push(e);
					} else if (nowTime >= startTime && nowTime <= endTime) {
						e.state = '0';
						state0.push(e);
					}
				})
				datalist = state0.concat(state1).concat(state2);
				var totalCount_return = datalist_tmp.length;
				var totalPage_return = dataJson["totalPage"];
				var pageIndex_return = postParam["pageIndex"];
				var pagesize_return = postParam["pageSize"];
				Obj.attr("totalCount", totalCount_return);
				Obj.attr("totalPage", totalPage_return);
				Obj.attr("pageIndex", pageIndex_return);
				Obj.attr("pagesize", pagesize_return);

				//保留模板行
				Obj.children().eq(0).hide();

				//清空上页数据
				if (isClean == "true" || isClean == true) {
					myCustomList.cleanList(id);
				}

				//所有字段代码数组
				var filedList = [];
				//添加本页数据
				for (var i = 0; i < datalist.length; i++) {//每一行数据
					var uuid = myCustomList.getUUID();
					var dataMap = datalist[i];
					var lineHtmlTmp = lineHtml;

					//替换模板变量
					for (var key in dataMap) {
						var value = dataMap[key];
						if (value == null || value == "null" || myCustomList.isUndefined(value)) {
							value = "";//美化null值
						}
						lineHtmlTmp = lineHtmlTmp.replace(eval('/{' + key + '}/g'), value);
					}

					lineHtmlTmp = lineHtmlTmp.replace(eval('/{order}/g'), pagesize_return * pageIndex_return + i + 1);//行号
					lineHtmlTmp = lineHtmlTmp.replace(eval('/{color}/g'), (i % 2 == 0) ? "color" : "");//隔行换色
					lineHtmlTmp = lineHtmlTmp.replace(eval('/{_row_id}/g'), uuid);//uuid
					Obj.append(lineHtmlTmp);//添加数据
					Obj.children(":last").attr("_row_id", uuid);//每一行元素主键
					//每一行所有字段和值记录在属性中
					for (var key in dataMap) {
						var value = dataMap[key];
						if (value == null || value == "null" || myCustomList.isUndefined(value)) {
							value = "";//美化null值
						}
						Obj.children(":last").attr(key.toLowerCase(), value);

						//记录所有字段代码数组
						if (i == 0) filedList.push(key);
					}
					//记录所有字段代码数组
					if (i == 0) {
						filedList = filedList = JSON.stringify(filedList);
						Obj.attr("filedList", filedList);
					}
				}

				//列表文字随页面宽度变化截取长度
				listTexttCut();

				//[按钮翻页模式下]分页条显示值、样式变化设置
				Obj.next().find(".page-num-input").val(pageIndex_return + 1);//当前显示页码
				Obj.next().find(".page-num-total").text(totalPage_return);//总页数
				Obj.next().find(".total-count").text("共" + totalCount_return + "条");//总记录数
				Obj.next().find(".last-page").css("background-color", "#2998DC");//上一页按钮颜色
				Obj.next().find(".next-page").css("background-color", "#2998DC");//下一页按钮颜色

				//特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求
				$(".list-total-count").text("总数：" + totalCount_return);
				//特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求  特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求 特殊需求

				//首页
				if (pageIndex_return == 0) {
					Obj.next().find(".last-page").css("background-color", "#B8B8B8");
				}
				//末页
				if ((pageIndex_return + 1) >= totalPage_return) {
					Obj.next().find(".next-page").css("background-color", "#B8B8B8");
					noMoreDiv(id);//[滚动翻页模式下]没有更多了
				}

				layerUtils.closeAll();

				if (datalist.length == 0) {
					var nodataHtml = '' +
						'<div id="nodata" style="position: absolute; top: calc(50% - 0.9rem); height: 1.8rem;  left: calc(50% - 0.6rem); width: 1.2rem;">' +
						'<div style="height: 1.12rem; width: 1.09rem;  background:  url(../image/nodata.png) no-repeat scroll center center; background-size: 100% 100%;"></div>' +
						'<div style="height: 0.25rem; margin-top: 0.2rem; text-align: center; font-size: 0.2rem; color: #47485A; font-weight: bold;">暂无数据</div>' +
						'</div>';
					// Obj.parent().append(nodataHtml);
					Obj.html(nodataHtml);
				} else {
					$("#nodata").remove();
				}

				//列表加载完毕回调方法
				onloadCallback();

			}
		});
	},

	//上一页
	lastPage: function (id) {
		var Obj = $("#" + id);
		var pageIndex = Obj.attr("pageIndex");//当前页码
		var totalPage = Obj.attr("totalPage");//总页数
		pageIndex = parseInt(pageIndex) - 1;//+1
		if ((pageIndex < 0) || ((pageIndex + 1) > parseInt(totalPage))) return;
		Obj.attr("pageIndex", pageIndex);//刷新页码记录
		Obj.myReLoad();//加载
		//$('html,body,#'+id).animate({scrollTop:0},50);//回到顶部
	},
	//下一页
	nextPage: function (id) {
		var Obj = $("#" + id);
		var pageIndex = Obj.attr("pageIndex");//当前页码
		var totalPage = Obj.attr("totalPage");//总页数
		pageIndex = parseInt(pageIndex) + 1;//-1
		if ((pageIndex < 0) || ((pageIndex + 1) > parseInt(totalPage))) return;
		Obj.attr("pageIndex", pageIndex);//刷新页码记录
		Obj.myReLoad();//加载
		//$('html,body,#'+id).animate({scrollTop:0},50);//回到顶部
	},
	//前往第几页
	gotoPage: function (id) {
		var Obj = $("#" + id);
		var totalPage = Obj.attr("totalPage");//总页数
		var pageIndexInput = parseInt(Obj.next().find(".page-num-input").val());//输入页数
		if ((pageIndexInput < 1) || ((pageIndexInput) > parseInt(totalPage))) return;
		Obj.attr("pageIndex", pageIndexInput - 1);//刷新页码记录
		Obj.myReLoad();//加载
		//$('html,body,#'+id).animate({scrollTop:0},50);//回到顶部
	},
	//清空列表
	cleanList: function (id) {
		var Obj = $("#" + id);
		Obj.children().each(function () {
			var index = $(this).index();
			if (index > 0) {
				$(this).remove();
			}
		});
	},
	//手动增加数据行
	addRows: function (id, datalist) {
		var Obj = $("#" + id);

		//获取数据行模板
		var lineHtml = Obj.attr("lineHtml");
		if (myCustomList.isUndefined(lineHtml)) {
			lineHtml = Obj.children().eq(0).prop("outerHTML");
			Obj.attr("lineHtml", lineHtml);
		}
		//添加数据行
		for (var i = 0; i < datalist.length; i++) {//每一行数据
			var uuid = myCustomList.getUUID();
			var dataMap = datalist[i];
			var lineHtmlTmp = lineHtml;
			for (var key in dataMap) {//每个字段
				var value = dataMap[key];
				if (value == "null" || myCustomList.isUndefined(value)) {
					value = "";//美化null值
				}
				lineHtmlTmp = lineHtmlTmp.replace(eval('/{' + key + '}/g'), value);
			}
			lineHtmlTmp = lineHtmlTmp.replace(eval('/{order}/g'), "0");//行号
			lineHtmlTmp = lineHtmlTmp.replace(eval('/{color}/g'), (i % 2 == 0) ? "color" : "");//隔行换色
			lineHtmlTmp = lineHtmlTmp.replace(eval('/{_row_id}/g'), uuid);//uuid
			Obj.children().eq(0).after(lineHtmlTmp);//添加数据
			Obj.children().eq(1).attr("_row_id", uuid);//元素主键
			for (var key in dataMap) {
				var value = dataMap[key];
				if (value == null || value == "null" || myCustomList.isUndefined(value)) {
					value = "";//美化null值
				}
				Obj.children(":last").attr(key.toLowerCase(), value);
			}
		}
	},
	//手动删除选择数据行
	deleteRows: function (id, selects) {
		var Obj = $("#" + id);
		for (var i = 0; i < selects.length; i++) {
			var _row_id = selects[i]["_row_id"];
			Obj.children().each(function () {
				var this_row_id = $(this).attr("_row_id");
				if (_row_id == this_row_id) {
					$(this).remove();
				}
			});
		}
	},
	//手动删除数据行(根据 _row_id)
	deleteRowsBy_row_id: function (id, _row_id) {
		var Obj = $("#" + id);
		Obj.children().each(function () {
			var this_row_id = $(this).attr("_row_id");
			if (_row_id == this_row_id) {
				$(this).remove();
			}
		});
	},
	//获取所有字段代码数组
	getFields: function (id) {
		var filedList = $("#" + id).attr("filedList");
		if (filedList == null || filedList == "" || filedList == undefined || filedList == "undefined" || typeof (filedList) == undefined) {
			filedList = "[]";
		}
		filedList = JSON.parse(filedList);
		return filedList;
	},
	//获取选择数据行
	getSelects: function (id) {
		var filedList = myCustomList.getFields(id);
		var returnList = [];
		$("#" + id).children().each(function () {
			var checked = $(this).find(".list-select").attr("select");
			if (checked == true || checked == "true") {
				var map = {};
				map["_row_id"] = $(this).attr("_row_id");
				for (var i = 0; i < filedList.length; i++) {
					var key = filedList[i];
					var value = $(this).attr(key);
					map[key] = value;
				}
				returnList.push(map);
			}
		});
		return returnList;
	},
	//获取数据行(根据 _row_id)
	getRowBy_row_id: function (id, _row_id) {
		var Obj = $("#" + id);

		var filedList = myCustomList.getFields(id);
		var returnList = [];
		Obj.children().each(function () {
			var this_row_id = $(this).attr("_row_id");

			if (_row_id == this_row_id) {
				var map = {};
				map["_row_id"] = $(this).attr("_row_id");
				for (var i = 0; i < filedList.length; i++) {
					var key = filedList[i];
					var value = $(this).attr(key);
					map[key] = value;
				}
				returnList.push(map);
			}
		});
		return returnList;
	},
	//获取当前页所有数据行
	getDatas: function (id) {
		var filedList = myCustomList.getFields(id);
		var returnList = [];
		$("#" + id).children().each(function () {
			var index = $(this).index();
			if (index > 0) {
				var map = {};
				map["_row_id"] = $(this).attr("_row_id");
				for (var i = 0; i < filedList.length; i++) {
					var key = filedList[i];
					var value = $(this).attr(key);
					map[key] = value;
				}
				returnList.push(map);
			}
		});
		return returnList;
	},
	isUndefined: function (value) {
		if (value == undefined || value == "undefined" || typeof (value) == undefined) {
			return true;
		} else {
			return false;
		}
	},
	isEmptyMap: function (map) {
		var t;
		for (t in map)
			return !1;
		return !0
	},
	getUUID: function () {
		var A = [],
			_ = "0123456789ABCDEF".split("");
		for (var $ = 0; $ < 36; $++) A[$] = Math.floor(Math.random() * 16);
		A[14] = 4;
		A[19] = (A[19] & 3) | 8;
		for ($ = 0; $ < 36; $++) A[$] = _[A[$]];
		A[8] = A[13] = A[18] = A[23] = "-";
		var uuid = A.join("");
		uuid = uuid.replace(/-/g, '');
		return uuid
	}
}


/**
 * 分页条HTML
 * 说明:在页面第一次加载时渲染分页条
 */
var pagerHtml = [
	'<div class="data-pager">',
	'<div>',
	'<div class="last-page" onclick="myCustomList.lastPage(\'{id}\')">上一页</div>',
	'<div class="page-num"><input class="page-num-input"/>/<span class="page-num-total"></span></div>',
	'<div class="goto-page" onclick="myCustomList.gotoPage(\'{id}\')">Go</div>',
	'<div class="next-page" onclick="myCustomList.nextPage(\'{id}\')">下一页</div>',
	'<div class="total-count"></div>',
	'</div> ',
	'</div>'
].join("");

/**
 * Loading条HTML
 * 说明:在页面第一次加载时渲染Loading条
 */
var pagerHtml_mobile = [
	'<div class="data-pager-loading" id="loading{id}">',
	'<p style="color:#CCCCCC; font-size: 0.1rem;">加载中...</p>',
	'</div>',
	'<div class="data-pager-loading" id="noMoreDiv{id}" style="display:none;">',
	'<p style="color:#CCCCCC; font-size: 0.1rem;"></p>',
	'</div>'
].join("");

/**
 * 没有更多了
 * 滚动翻页模式下对“loding”和“没有更多了”的显示隐藏
 */
function noMoreDiv (id) {
	$("#loading" + id).hide();//隐藏底部Loading条
	$("#noMoreDiv" + id).show();//显示没有更多条
}

function dateFormat (date, fmt) {
	var ret;
	var opt = {
		'y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'H+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		'S+': date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (var k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
		}
	}
	return fmt;
}

/**
 * 构造方法，防止调用者未声明此方法而报错
 */
function listTexttCut () {

}

/**
 * 构造方法，防止调用者未声明此方法而报错
 */
function onloadCallback () {

}

/**
 * 列表复选框点击事件
 * 说明：复选框用需要用div模拟而成，类名为 .list-select
 */
function removeSelect (obj) {
	obj.attr("select", "false");
	obj.removeClass("active");
	obj.parent().parent().removeClass("active");
}
function addSelect (obj) {
	obj.attr("select", "true");
	obj.addClass("active");
	obj.parent().parent().addClass("active");
}
$(document).ready(function () {
	//子勾选
	$("body").on("click", ".list-select", function () {
		var checked = $(this).attr("select");
		if (checked == true || checked == "true") {
			removeSelect($(this));//去除选择
			//总项
			if ($(this).parent().parent().parent().parent().find(".list-selAll").length > 0) {
				$(this).parent().parent().parent().parent().find(".list-selAll").each(function () {
					removeSelect($(this));//去除选择
				});
			}
		} else {
			addSelect($(this));//选中
		}
	});
	//总勾选
	$("body").on("click", ".list-selAll", function () {
		var checked = $(this).attr("select");
		if (checked == true || checked == "true") {
			removeSelect($(this));//去除选择
			//子项
			if ($(this).parent().parent().parent().parent().find(".list-select").length > 0) {
				$(this).parent().parent().parent().parent().find(".list-select").each(function () {
					removeSelect($(this));//去除选择
				});
			}
		} else {
			addSelect($(this));//选中
			//子项
			if ($(this).parent().parent().parent().parent().find(".list-select").length > 0) {
				$(this).parent().parent().parent().parent().find(".list-select").each(function () {
					var isHidden = $(this).is(":hidden");
					if (isHidden != true && isHidden != "true") {//第一行隐藏模板不勾选
						addSelect($(this));//选中
					}
				});
			}
		}
	});
});
