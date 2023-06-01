/**
 * Created by xwx on 2018/06/06.
 * 使用需配置showType 与 option 参数对应
 * 必要css：	font-awesome.min.css
 * 			sidebarSkins.css
 * 			monui.css
 * 			sidebar.css
 * 			
 * 必要js：	commonTool.js
 */
var sidebar = {};

$(function () {
	//sidebar.init();
	sidebar.resize();
});

var flowViewResize = function () {
	var div = $(".siderbar-flowView-showDiv");
	if (div.length > 0) {
		div.each(function (i) {
			var jq = $(this);
			var tables = jq.find(".sidebar-flowView-table");
			var btn = jq.find(".sidebar-flowView-addBtn");
			if (btn.length > 0 && tables.length > 0) {
				var w1 = parseInt(jq.width()) - 5;
				var w2 = parseInt(btn.width());
				if (!jq.data("minWidth")) {
					jq.data("minWidth", w2);
				}
				var minW = jq.data("minWidth");
				w3 = 2 * parseInt(btn.css("border-bottom-width")) + parseInt(btn.css("margin-right")) + parseInt(btn.css("margin-left"));
				var num = parseInt(w1 / (minW + w3));
				var width = parseInt(w1 / num) - w3;
				tables.each(function (i) {
					var ta = $(this);
					var closeBtn = ta.find(".closeBtn");
					closeBtn.css("left", (width - closeBtn.width() + 3) + "px");
					ta.width(width + "px");
				});
				btn.width(width + "px");
			}
		});
	}

}

sidebar.resize = function () {

	$(window).resize(flowViewResize);
};


sidebar.changePanelStatus = function (target) {
	if (target) {
		var panel = $(target);
		panel.toggleClass("active");
	} else {
		var panel = $(".m-panel");
		var right = $(".m-sidebar-right");
		if (!panel.hasClass("active")) {
			panel.addClass("active");
			if (right.find(".active").length > 0) {
				right.addClass("active");
			}
		} else {
			panel.removeClass("active");
			right.removeClass("active");
		}
	}

}

sidebar.init = function () {
	sidebar._build();
	/*$(".close-sect").on("click", function () {
		var target = $(this).attr("close-target");
		var checkedClick = $(this).attr("checked-click");
		if (checkedClick) {
			var fun = eval(checkedClick);
			if (typeof (fun) == 'boolean') {
				if (fun) return;
			} else {
				fun = eval("window." + checkedClick);
				if (typeof (fun) == 'boolean') {
					if (fun) return;
				}
			}
		}
		if (target == '') target = null;
		sidebar.changePanelStatus(target);

	});*/

	/*$(".close-sect").on("click", function(){
		var checkedShow=$(this).attr("checked-show");
		if(checkedShow){
			if(typeof(checkedShow)!='function'){
				var fun=eval(checkedShow);
				if(typeof(fun)!='function'){
					fun=eval("window."+checkedShow);
				}
				checkedShow=fun;
			}
			if(typeof(checkedClick)=='function'&&!checkedClick()){
				return ;
			}
		}
		if(target=='') target=null;
		sidebar.changePanelStatus(target);
		
	});*/

	$(".list-icon").on("click", function () {
		if (!$(this).parent().hasClass("active")) {
			var target = $(this).parent().attr("data-target");
			$(".active").removeClass("active");
			$(this).parent().addClass("active");
			$("#" + target).addClass("active");
			$("#" + target).parent().addClass("active");
			if ($(".m-sidebar-right .active").length == 0) {
				$(".m-sidebar-right").removeClass("active");
			}
		}
	});
}

sidebar._build = function () {
	// var type=["toggle","table","multSelect","searchText","subList","menu","floatTipSelect"];
	// for(var i=0;i<type.length;i++){
	// 	sidebar._bulidObj[type[i]]();
	// }
	for (var key in sidebar._bulidObj) {
		sidebar._bulidObj[key]();
	}
}

$.fn.sidebarCreate = function (data) {
	var jq = $(this);
	if (jq.sidebarGet() && jq.sidebarGet()._parent) {
		jq = jq.sidebarGet()._parent;
	}
	if (data) {
		if (data.indexOf("-") > -1) {
			data = data.split("-")[1];
		}
	} else {
		var a = "sidebar-";
		// var type=["toggle","table","multSelect","searchText","subList","flowView","flowSelect","menu","floatTipSelect"];
		// for(var i=0;i<type.length;i++){
		// 	if(jq.hasClass(a+type[i])){
		// 		data=type[i];
		// 		break;
		// 	}
		// }
		for (var key in sidebar._bulidObj) {
			if (jq.hasClass(a + key)) {
				data = type[i];
				break;
			}
		}

	}
	if (data) {
		var func = sidebar._bulidObj[data];
		if (typeof func == 'function') {
			jq.empty();
			func(jq);
		}
	}

}

$.fn.sidebarGet = function () {
	return $(this).data("child") || $(this).parent().data("child");
};

sidebar._bulidObj = {
	toggle: function (jq) {
		if (jq) {
			var child = new sidebarToggle(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-toggle").each(function (i) {
			var child = new sidebarToggle($(this));
			$(this).data("child", child);
		});
	},
	table: function (jq) {
		if (jq) {
			var child = new sidebarTable(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-table").each(function (i) {
			var child = new sidebarTable($(this));
			$(this).data("child", child);
		});
	},
	multiSelect: function (jq) {
		if (jq) {
			var child = new sidebarMultiSelect(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-multiSelect").each(function (i) {
			var child = new sidebarMultiSelect($(this));
			$(this).data("child", child);
		});
	},
	searchText: function (jq) {
		if (jq) {
			var child = new sidebarSearchText(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-searchText").each(function (i) {
			var child = new sidebarSearchText($(this));
			$(this).data("child", child);
		});
	},
	subList: function (jq) {
		if (jq) {
			var child = new sidebarSubList(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-subList").each(function (i) {
			var child = new sidebarSubList($(this));
			$(this).data("child", child);
		});
	},
	flowView: function (jq) {
		if (jq) {
			var child = new sidebarFlowView(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-flowView").each(function (i) {
			var child = new sidebarFlowView($(this));
			$(this).data("child", child);
		});
	},
	flowSelect: function (jq) {
		if (jq) {
			var child = new sidebarFlowSelect(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-flowSelect").each(function (i) {
			var child = new sidebarFlowSelect($(this));
			$(this).data("child", child);
		});
	},
	menu: function (jq) {
		if (jq) {
			var child = new sidebarMenu(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-menu").each(function (i) {
			var child = new sidebarMenu($(this));
			$(this).data("child", child);
		});
	},
	floatTipSelect: function (jq) {
		if (jq) {
			var child = new sidebarFloatTipSelect(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-floatTipSelect").each(function (i) {
			var child = new sidebarFloatTipSelect($(this));
			$(this).data("child", child);
		});
	},
	floatTip: function (jq) {
		if (jq) {
			var child = new sidebarFloatTip(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-floatTip").each(function (i) {
			var child = new sidebarFloatTip($(this));
			$(this).data("child", child);
		});
	},
	multiSelectTree: function (jq) {
		if (jq) {
			var child = new sidebarMultiSelectTree(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-multiSelectTree").each(function (i) {
			var child = new sidebarMultiSelectTree($(this));
			$(this).data("child", child);
		});
	},
	pageTable: function (jq) {
		if (jq) {
			var child = new sidebarPageTable(jq);
			jq.data("child", child);
			return;
		}
		$(".sidebar-pageTable").each(function (i) {
			var child = new sidebarPageTable($(this));
			$(this).data("child", child);
		});
	}
};

var sidebarFloatTip = function (jq) {
	this._init(jq);
}

sidebarFloatTip.prototype.colorList = ["#CDBC87", "#87ADCD", "#BA87CD", "#CD8787"];

sidebarFloatTip.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;

	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this._initBody();
}
sidebarFloatTip.prototype._initBody = function () {
	var me = this;
	var json = this._json;
	if (json.url) {
		var url = json.url;
		var type = json.type || "POST";
		var params = json.params || {};
		$.ajax({
			url: url,
			type: type,
			data: params,
			success: function (datas) {
				if (datas&&!commonTool.isArray(datas)) datas = JSON.parse(datas);
				me._createbody(datas);
			}
		});
	} else if (json.datas) {
		me._createbody(json.datas);
	}
}


sidebarFloatTip.prototype._createbody = function (datas) {
	var parent = this._parent;
	parent.empty();
	var json = this._json;
	var id = this._id;
	var text = json.text || "";
	if (commonTool.isArray(datas)) {
		var panel = $("<div class='sidebar-float-panel'>");
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];
			var total = $("<div class='sidebar-ib sidebar-tip-div'>");
			var color = data.iconColor;
			var colorDiv = $("<i class='sidebar-color-div' style='background-color:" + color + "'>");
			total.append(colorDiv);
			var div = $("<div class='sidebar-text'>");
			div.html(data.text || "");
			total.append(div);
			panel.append(total);
		}
		parent.append(panel);
	}
}


var sidebarFloatTipSelect = function (jq) {
	this._init(jq);
}

sidebarFloatTipSelect.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this._createbody();
}

sidebarFloatTipSelect.prototype._createbody = function () {
	var me = this;
	var parent = this._parent;
	var json = this._json;
	var id = this._id;
	var text = json.text || "";
	var clickFun = commonTool.isFunction(json.click) ? json.click : "";
	var panel = $("<div class='sidebar-float-panel'>");
	panel.bind("click", function () {
		$(this).children("i").toggleClass("sidebar-select");
		if (clickFun) clickFun();
	});
	var i = $("<i class='sidebar-unselect-img'>");
	panel.append(i);
	var div = $("<div class='sidebar-text'>");
	div.html(text);
	panel.append(div);
	parent.append(panel);
}

sidebarFloatTipSelect.prototype.isSelect = function () {
	return this._parent.find("i").hasClass("sidebar-select");
}

var sidebarFlowSelect = function (jq) {
	this._init(jq);
}

sidebarFlowSelect.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this.flowWidth = showObj.flowWidth || "5rem";
	this.flowHeight = showObj.flowHeight || "1.2rem";
	this._createbody();
}

sidebarFlowSelect.prototype._createbody = function () {
	var parent = this._parent;
	var json = this._json;
	var id = this._id;
	var me = this;
	if (json.url) {
		var url = this._url = json.url;
		var type = this._type = json.type || "POST";
		var params = this._params = json.params || {};
		$.ajax({
			url: url,
			type: type,
			data: params,
			success: function (datas) {
				var datasJson = JSON.parse(datas);
				if (commonTool.isArray(datasJson)) {
					me.dataList = datasJson;
					me._createHideView();
					me._createAddBtn(parent, id);
					me._createAddView(parent, id);
				}
			}
		});
	}
}

sidebarFlowSelect.prototype._createHideView = function () {
	var hideView = $('<div class="hideView" style="visibility: hidden;position: absolute;right: 9999px"></div>');
	hideView.appendTo($("body"));
	this._hideView = hideView;
}

sidebarFlowSelect.prototype._createAddBtn = function (parent, id) {
	var json = this._json;
	var addBtn = json.addBtnText || "添加对比项";
	var me = this;
	var w = this.flowWidth;
	var h = this.flowHeight;
	var hideView = this._hideView;
	var div1 = $("<div data-toggle='modal'data-target='#" + id + "Hide' class='sidebar-flowSelect-addBtn' style='display:inline-block'></div>");
	div1.appendTo(hideView);
	var div2 = $("<div><img src='images/sidebar/addBtn.png' style='height: .7rem;padding-bottom:.1rem;'>" + addBtn + "</div>");
	div2.appendTo(div1);
	w2 = div2.width();
	h2 = div2.height();
	var w3 = (div1.width() - div2.width()) / 2;
	var h3 = (div1.height() - div2.height()) / 2;
	div2.css("padding", h3 + "px " + w3 + "px 0 0");
	var div0 = $("<div class='siderbar-flowSelect-showDiv' id='" + id + "'></div>");
	div1.appendTo(div0);
	div0.appendTo(parent);
	hideView.html();
}

sidebarFlowSelect.prototype._createAddView = function (parent, id) {
	var json = this._json;
	var me = this;
	var title = json.hideTitle || "请选择对比项";
	var search = json.hideSearch || "对比项搜索";
	var parent = this._parent;
	var showView = parent.find(".siderbar-flowSelect-showDiv").eq(0);
	var click = function () {
		var hideId = id + "Hide";
		showView.find(".content").remove();
		$("#" + hideId + " .active").each(function (i) {
			var old = $(this);
			var node = this.cloneNode(true);
			var children = showView.children();
			var div = $(node);
			div.removeAttr("id");
			div.insertBefore(children.eq(children.length - 1));
			var img = div.find("span").eq(0);
			div.addClass("positon-relative");
			div.removeClass("unshow");
			var btn = $('<button type="button" class="closeBtn">&times;</button>');
			btn.css("left", div.width() - parseInt($("html").css("font-size")) * 0.8 + "px");
			btn.css("top", -parseInt($("html").css("font-size")) * 0.2 + "px");
			btn.insertBefore(img);
			div.data("data", old.data("data"));
			div.data("id", old.data("id"));
			btn.data("id", old.data("id"));
			btn.bind("click", function () {
				var linkId = btn.data("id");
				$("#" + linkId).removeClass("active");
				$(this).parent().remove();
				if (json.onChange) {
					json.onChange();
				}
			});
		});
		$("#" + hideId).modal('hide');
		if (json.onChange) {
			json.onChange();
		}
	};
	var div1 = $('<div class="modal fade bs-example-modal-lg" id="' + id + 'Hide" tabindex="-1" role="dialog" aria-labelledby="' + id + 'HideTitle" aria-hidden="true"></div>');
	div1.appendTo(parent);

	var div2 = $('<div class="modal-dialog modal-llg">');
	div2.appendTo(div1);
	var div3 = $('<div class="modal-content">');
	div3.appendTo(div2);
	var header = $('<div class="modal-header">');
	header.appendTo(div3);
	var btn = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
	btn.appendTo(header);
	var title = $('<span class="modal-title" id="' + id + 'HideTitle">' + title + '</span>');
	title.appendTo(header);
	var searchInput = $('<input id="' + id + 'HideInput" class="modal-input" type="text" placeholder="' + search + '"/>');
	searchInput.appendTo(header);


	var fun = function (aaa) {
		var val = aaa.val();
		parent.find(".modal-body .content").each(function (i) {
			if (commonTool.isEmpty(val)) {
				$(this).removeClass("unshow");
			}
			if ($(this).find("span").eq(0).html().indexOf(val)) {
				$(this).addClass("unshow");
			} else {
				$(this).removeClass("unshow");
			}
		});
	}
	commonTool.bindInputChange(searchInput, fun);

	var body = $('<div class="modal-body"></div>');
	body.appendTo(div3);
	if (json.hideViewStyle) {
		body.attr("style", json.hideViewStyle);
	}
	var foot = $('<div class="modal-footer"></div>');
	foot.appendTo(div3);
	var btn1 = $('<button type="button" class="btn btn-primary">确定</button>');
	btn1.appendTo(foot);
	var btn2 = $('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');
	btn2.appendTo(foot);
	btn1.bind("click", click);
	this._initBody(body);
}


sidebarFlowSelect.prototype._initBody = function (body) {
	var me = this;
	var dataList = this.dataList;
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		var div = me._createDiv(data);
		if (div) {
			div.appendTo(body);
			div.bind("click", function () {
				$(this).toggleClass("active");
			});
		}

	}
}

sidebarFlowSelect.prototype._createDiv = function (json) {
	id = commonTool.uuid();
	var title = json.title;
	if (title) {
		var div = $('<div id="' + id + '" class="content"></div>');
		div.html("<span>" + title + "</span>");
		div.data("data", json);
		div.data("id", id);
		return div;
	}
}

sidebarFlowSelect.prototype.getSelectRows = function () {
	var tables = this._parent.find(".siderbar-flowSelect-showDiv").eq(0).find(".content");
	var array = new Array();
	if (tables) {
		for (var i = 0; i < tables.length; i++) {
			var table = tables.eq(i);
			array.push(table.data("data"));
		}
	}
	return array;
}

var sidebarFlowView = function (jq) {
	this._init(jq);
}


sidebarFlowView.prototype.getSelectRows = function () {
	var tables = this._parent.find(".siderbar-flowView-showDiv").eq(0).find(".sidebar-flowView-table");
	var array = new Array();
	if (tables) {
		for (var i = 0; i < tables.length; i++) {
			var table = tables.eq(i);
			array.push(table.data("data"));
		}
	}
	return array;
}

sidebarFlowView.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this.flowWidth = showObj.flowWidth || "10rem";
	this.flowHeight = showObj.flowHeight || "4rem";
	this._createbody();
}

sidebarFlowView.prototype._createbody = function () {
	var parent = this._parent;
	var json = this._json;
	var id = this._id;
	var me = this;
	if (json.url) {
		var url = this._url = json.url;
		var type = this._type = json.type || "POST";
		var params = this._params = json.params || {};
		$.ajax({
			url: url,
			type: type,
			data: params,
			success: function (datas) {
				var datasJson = JSON.parse(datas);
				if (commonTool.isArray(datasJson)) {
					me.dataList = datasJson;
					me._createHideView();
					//me._createTitle();
					me._createAddBtn(parent, id);
					me._createAddView(parent, id);
				}
			}
		});
	}
}

sidebarFlowView.prototype._createTitle = function () {
	var parent = this._parent;
	parent.addClass("map-data-list base-data");
	//var a=$('<a class="title active" title="行政区划">行政区划<span class="fa fa-angle-down"></span></a>');
	var a = $('<a class="data-header dcjq-parent active" title="行政区划">行政区划<span class="fa fa-angle-down"></span></a>');
	a.appendTo(parent);
	var dataHeaderClick = function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this).parent().find(".siderbar-flowView-showDiv").eq(0).addClass("unshow");
		} else {
			$(this).addClass("active");
			$(this).parent().find(".siderbar-flowView-showDiv").eq(0).removeClass("unshow");
		}
		return false;
	};
	a.on("click", dataHeaderClick);
}

sidebarFlowView.prototype._createHideView = function () {
	var hideView = $('<div class="hideView" style="visibility: hidden;position: absolute;right: 9999px"></div>');
	hideView.appendTo($("body"));
	this._hideView = hideView;
}

sidebarFlowView.prototype._createAddBtn = function (parent, id) {
	var json = this._json;
	var addBtn = json.addBtnText || "添加对比项";
	var me = this;
	var w = this.flowWidth;
	var h = this.flowHeight;
	var hideView = this._hideView;
	var div1 = $("<div data-toggle='modal'data-target='#" + id + "Hide' class='sidebar-flowView-addBtn' style='width:" + w + ";height:" + h + ";display:inline-block'></div>");
	div1.appendTo(hideView);
	var div2 = $("<div><img src='images/sidebar/addBtn.png' style='height: 1rem;padding-bottom:.1rem;'>" + addBtn + "</div>");
	div2.appendTo(div1);
	w2 = div2.width();
	h2 = div2.height();
	var w3 = (div1.width() - div2.width()) / 2;
	var h3 = (div1.height() - div2.height()) / 2;
	div2.css("padding", h3 + "px " + w3 + "px 0 0");
	var div0 = $("<div class='siderbar-flowView-showDiv' id='" + id + "'></div>");
	div1.appendTo(div0);
	div0.appendTo(parent);
	hideView.html();
}

sidebarFlowView.prototype._createAddView = function (parent, id) {
	var json = this._json;
	var me = this;
	var title = json.hideTitle || "请选择对比项";
	var search = json.hideSearch || "对比项搜索";
	var parent = this._parent;
	var showView = parent.find(".siderbar-flowView-showDiv").eq(0);
	var click = function () {
		var hideId = id + "Hide";
		showView.find(".sidebar-simply-table.sidebar-flowView-table").remove();
		$("#" + hideId + " .active").each(function (i) {
			var old = $(this);
			var node = this.cloneNode(true);
			var children = showView.children();
			var table = $(node);
			table.removeAttr("id");
			table.insertBefore(children.eq(children.length - 1));
			var title = table.find(".sidebar-simply-table-title").eq(0);
			table.addClass("positon-relative");
			table.removeClass("unshow");
			var btn = $('<button type="button" class="closeBtn">&times;</button>');
			/*btn.css("left",table.width()-parseInt($("html").css("font-size"))*0.8+"px");
			btn.css("top",-parseInt($("html").css("font-size"))*0.2+"px");*/
			btn.appendTo(title);
			table.data("data", old.data("data"));
			table.data("id", old.data("id"));
			btn.data("id", old.data("id"));
			btn.bind("click", function () {
				var linkId = btn.data("id");
				$("#" + linkId).removeClass("active");
				var i = 0;
				var a = $(this);
				while (i < 5) {
					a = a.parent();
					if (a.hasClass("sidebar-flowView-table")) {
						a.remove();
						break;
					}
					i++;
				}
				if (json.onChange) {
					json.onChange();
				}
			});
		});
		flowViewResize();
		$("#" + hideId).modal('hide');
		if (json.onChange) {
			json.onChange();
		}
	};
	var div1 = $('<div class="modal fade bs-example-modal-lg" id="' + id + 'Hide" tabindex="-1" role="dialog" aria-labelledby="' + id + 'HideTitle" aria-hidden="true"></div>');
	div1.appendTo(parent);
	var div2 = $('<div class="modal-dialog modal-llg">');
	div2.appendTo(div1);
	var div3 = $('<div class="modal-content">');
	div3.appendTo(div2);
	var header = $('<div class="modal-header">');
	header.appendTo(div3);
	var btn = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
	btn.appendTo(header);
	var title = $('<span class="modal-title" id="' + id + 'HideTitle">' + title + '</span>');
	title.appendTo(header);
	var searchInput = $('<input id="' + id + 'HideInput" class="modal-input" type="text" placeholder="' + search + '"/>');
	searchInput.appendTo(header);
	var fun = function (aaa) {
		var val = aaa.val();
		parent.find(".modal-body .sidebar-simply-table.sidebar-flowView-table").each(function (i) {
			if (commonTool.isEmpty(val)) {
				$(this).removeClass("unshow");
			}
			if ($(this).find(".sidebar-simply-table-title").eq(0).html().indexOf(val) < 0) {
				$(this).addClass("unshow");
			} else {
				$(this).removeClass("unshow");
			}
		});
	};
	commonTool.bindInputChange(searchInput, fun);

	var body = $('<div class="modal-body"></div>');
	body.appendTo(div3);
	if (json.hideViewStyle) {
		body.attr("style", json.hideViewStyle);
	}
	var foot = $('<div class="modal-footer"></div>');
	foot.appendTo(div3);
	var btn1 = $('<button type="button" class="btn btn-primary">确定</button>');
	btn1.appendTo(foot);
	var btn2 = $('<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');
	btn2.appendTo(foot);
	btn1.bind("click", click);
	this._initBody(body);
}

sidebarFlowView.prototype._initBody = function (body) {
	var me = this;
	var dataList = this.dataList;
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		var table = me._createTable(data);
		table.appendTo(body);
		table.bind("click", function () {
			$(this).toggleClass("active");
		});
	}
}

sidebarFlowView.prototype._createTable = function (data) {
	var id = commonTool.uuid();
	var json = this._json;
	var hideView = this._hideView;
	var table = $("<table class='sidebar-simply-table sidebar-flowView-table' id='" + id + "'>");
	table.css("width", this.flowWidth);
	table.css("height", this.flowHeight);
	var tr1 = $("<tr>");
	tr1.appendTo(table);
	var tr2 = $("<tr>");
	tr2.appendTo(table);
	var td1 = $("<td rowspan='2' style='height:" + this.flowHeight + "'>");
	var td2 = $("<td class='sidebar-simply-table-title'>");
	var td3 = $("<td class='sidebar-simply-table-content'>");
	td1.appendTo(tr1);
	td2.appendTo(tr1);
	td3.appendTo(tr2);
	var title = data.title || "";
	td2.html($("<span>" + title + "</span>"));
	var content = data.content || "";
	td3.html(content);
	table.appendTo(hideView);
	if (data.img) {
		var img = $("<img src='" + data.img + "'>");
		if (json.imgCss) {
			img.attr("style", json.imgCss);
		} else {
			img.css("height", table.height() - parseInt($("html").css("font-size")) + "px");
		}
		img.appendTo(td1);
	}
	hideView.html("");
	table.data("data", data);
	table.data("id", id);
	return table;
}


var sidebarSubList = function (jq) {
	this._init(jq);
}

sidebarSubList.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._createbody();
}

sidebarSubList.prototype._createbody = function () {
	var me = this;
	var json = this._json;
	var id = json.id || commonTool.uuid();
	var pid = json.pid || commonTool.uuid();
	var parent = this._parent;
	var div = $('<div class="map-sub-list sublist">');
	div.appendTo(parent);
	var ul = $("<ul>");
	ul.appendTo(div);
	var data = json.data;
	var clickFun = function (e) {
		var target = $(this).attr('data-target');
		if (target) {
			$("#" + target.split("--")[0]).removeClass("active");
			$("#" + target).addClass("active");
		}
		var data = $(this).data("data");
		if (data && data.click) {
			data.click(this);
		}
	};
	if (data) {
		for (var i = 0; i < data.length; i++) {
			var msg = data[i];
			var li;
			if (msg.target) {
				li = $("<li data-target='" + pid + "--" + msg.target + "'>" + msg.title + "</li>");
			} else {
				li = $("<li>" + msg.title + "</li>");
			}
			li.data("data", msg);
			li.bind("click", clickFun);
			li.appendTo(ul);
		}
	}
}


var sidebarSearchText = function (jq) {
	this._init(jq);
}

sidebarSearchText.prototype._init = function (jq) {
	this._parent = jq;
	var opition = this._parent.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._createbody();
}



sidebarSearchText.prototype._createbody = function () {
	var me = this;
	var id = me._json.id || commonTool.uuid();
	var parent = this._parent;
	var input = $('<input class="sec-search" placeholder="搜索" id="' + id + '"></input>');
	input.appendTo(parent);
	this._input = input;
	var fun = function () {
		me.loadSearchData(me._json.searchDate($("#" + id).val()));
		parent.find("ul").eq(0).removeClass("unshow");
	}
	commonTool.bindInputChange(input, fun);


	var ul = $("<ul class='sidebar-search-hidden unshow'>");
	ul.appendTo(parent);
	this.dataUl = ul;
}

sidebarSearchText.prototype.loadSearchData = function (data) {
	var ul = this.dataUl;
	var me = this;
	var json = this._json;
	ul.empty();
	for (var i = 0; i < data.length; i++) {
		var li = $("<li>");
		li.appendTo(ul);
		li.data("data", data[i]);
		li.bind("click", function () {
			json.onSelect($(this).data("data"));
			me._input.val($(this).data("data")["name"]);
			ul.addClass("unshow");
		});
		var span1 = $("<span>" + data[i][json["text1"]] + "</span>");
		span1.appendTo(li);
	}
}

var sidebarMenu = function (jq) {
	this._init(jq);
}

sidebarMenu.prototype._init = function (jq) {
	this._parent = jq;
	var opition = this._parent.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._json.menuMaxLength = showObj.menuMaxLength || 10;
	this._createbody();
}

sidebarMenu.prototype._createbody = function () {
	var me = this;
	var parent = this._parent;
	var json = me._json;
	var id = json.id || commonTool.uuid();
	var title = json.title || "";
	parent.addClass("map-data-list base-data");
	parent.empty();
	var div = $('<div class="data-header" id="' + id + '"  source="root" target="' + id + '_menu"></div>');
	var text = $('<div class="sidebar-menu-title">' + title + '</div>');
	div.append(text);
	parent.append(div);

	text.on("click", function (e) {
		e = event || e;
		var that = $(this).parent();
		that.addClass("sidebar-menu-hover");
		var hovers = parent.find(".sidebar-menu-hover");
		var num = hovers.length;
		if (num > 0 && hovers.eq(num - 1).find(".sidebar-menu-items").length > 0) num++;
		if (num < 2) num = 2;
		var w = div.outerWidth() * num;
		parent.width(w);
		if (json.widthChange) json.widthChange(w);
		e.preventDefault();
		e.stopPropagation();
	});

	/*text.hover(function(){
		var that=$(this).parent();
		that.addClass("sidebar-menu-hover");
		var hovers=parent.find(".sidebar-menu-hover");
		var num=hovers.length;
		if(num>0&&hovers.eq(num-1).find(".sidebar-menu-items").length>0) num++;
		if(num<2) num=2;
		var w=div.outerWidth()*num;
		parent.width(w);
		if(json.widthChange) json.widthChange(w);
	});*/
	if (json.url) {
		var url = this._url = json.url;
		var type = this._type = json.type || "POST";
		var params = this._param = json.params || {};
		var createItem = function (data) {
			var name = data.name || "";
			var id = data.id || "";
			var item = $('<div sourceId="' + id + '" class="sidebar-menu-item"></div>');
			var span = $('<span>' + name + '</span>');
			item.append(span);
			span.hover(function () {
				var that = $(this).parent();
				that.parent().find(".sidebar-menu-hover").each(function (i) {
					$(this).removeClass("sidebar-menu-hover");
				})
				that.addClass("sidebar-menu-hover");
				var w = that.offset().left - div.offset().left + div.outerWidth();
				if (data.children) {
					w += div.outerWidth();
					var offTop = that.offset().top;
					var root = parent.offsetParent();
					var total = root.outerHeight() + root.offset().top;
					var l = that.outerHeight();
					var topNum = Math.floor(offTop / l);
					var bottonNum = Math.floor((total - offTop) / l);
					var top = 0;
					var childL = data.children.length;
					//console.log(bottonNum);
					//console.log("menuMaxLength:::" + json.menuMaxLength);
					var childItem = that.children(".sidebar-menu-items");
					//最后一级菜单可以出现滚动条，menuMaxLength为默认不出现滚动条数量
					if (json.menuMaxLength && childL > json.menuMaxLength && (childItem && childItem.children(".sidebar-menu-items").length == 0)) {
						childL = json.menuMaxLength;
						childItem.height(childL * l);
						childItem.css("overflow-y", "auto");
						childItem.css("overflow-x", "visible");
					}
					if (childL > topNum + bottonNum) {
						top = topNum * l * -1;

					} else if (childL > bottonNum) {
						top = (bottonNum - childL) * l;
					}
					childItem.css("top", top);
				}
				parent.width(w);
				if (json.widthChange) json.widthChange(w);
			});

			if (commonTool.isArray(data.children)) {
				var child = createItems(data.children);
				item.append(child);
			} else {
				item.click(function () {
					div.removeClass("sidebar-menu-hover");
					var w = div.width();
					parent.width(w);
					me._selectId = id;
					if (id) {
						parent.find(".sidebar-menu-title").text(name);
					} else {
						parent.find(".sidebar-menu-title").text(title);
					}
					if (json.widthChange) json.widthChange(w);
					if (json.click) json.click();
				});
			}
			return item;
		}
		var createItems = function (datas) {
			if (!commonTool.isArray(datas)) datas = [];
			var items = $('<div class="sidebar-menu-items"></div>');
			for (var i = 0; i < datas.length; i++) {
				var data = datas[i];
				var item = createItem(data);
				items.append(item);
			}
			return items;
		}
		$.ajax({
			url: url,
			type: type,
			data: params,
			dataType: "json",
			success: function (datas) {
				var datas = JSON.parse(datas);
				me._datas = datas;
				var items = createItems(datas);
				items.addClass("border");
				div.append(items);
			}
		});
	}


}

sidebarMenu.prototype.getSelected = function () {
	return this._selectId || "";
}

sidebarMenu.prototype.clear = function () {
	var me = this;
	var parent = this._parent;
	var json = me._json;
	var title = json.title || "";
	this._selectId = "";
	parent.find(".sidebar-menu-hover").each(function (i) {
		$(this).removeClass('sidebar-menu-hover');
	});
	parent.find(".sidebar-menu-title").text(title);
}


var sidebarMultiSelect = function (jq) {
	this._init(jq);
}

sidebarMultiSelect.prototype.reload = function (params) {
	this._parent.empty();
	if (params) {
		var params2 = $.extend({}, this._json.params || {});
		this._params = $.extend(params2, params);
	}
	this._createbody();
}

sidebarMultiSelect.prototype.getSelected = function () {
	var reVal = [];
	this._parent.find("ul>li .active").each(function (i) {
		var data = $(this).data("data");
		if(data&&(data.id||data.id===0))reVal.push(data.id);
	});
	return reVal;
}

sidebarMultiSelect.prototype.getAll = function () {
	var reVal = [];
	this._parent.find("ul>li").each(function (i) {
		var data = $(this).data("data");
		if(data&&(data.id||data.id===0))reVal.push(data.id);
	});
	return reVal;
}


sidebarMultiSelect.prototype.search = function (params) {
	var reVal = [];
	this._parent.find("ul>li").each(function (i) {
		var data = $(this).data("data");
		for (var i = 0; i < params.length; i++) {
			var param = params[i];
			var title = param.title;
			var type = param.type;
			var search = param.search;
			var val = data[title];
			if (type == "contain") {
				if (val.indexOf(search) == -1) {
					break;
				}
			} else if (type == "like") {
				if (val.indexOf(search) == -1) {
					break;
				}
			}

		}
		reVal.push(data);
	});
	return reVal;
}

sidebarMultiSelect.prototype.updateShow = function (params) {
	this._parent.find("ul>li").each(function (i) {
		var data = $(this).data("data");
		$(this).removeClass("unshow");
		for (var i = 0; i < params.length; i++) {
			var param = params[i];
			var title = param.title;
			var type = param.type;
			var search = param.search;
			if (search == null || search == "") {
				break;
			}
			var val = data[title];
			if (type == "contain") {
				if (search.indexOf(val) == -1) {
					$(this).addClass("unshow");
					break;
				}
			} else if (type == "like") {
				if (val.indexOf(search) == -1) {
					$(this).addClass("unshow");
					break;
				}
			}

		}
	});
}

sidebarMultiSelect.prototype.setValue = function (value) {
	value = value || "";
	var ids = value.split(",");
	this._parent.find("ul>li").each(function (i) {
		var jq = $(this);
		var data = jq.data("data");
		var label = jq.find("label").eq(0);
		for (var j = 0; j < ids.length; j++) {
			var id = ids[j];
			if (data.id == id) {
				label.addClass("active");
				return;
			}
		}
		label.removeClass("active");
	});
}

sidebarMultiSelect.prototype.getSelectRows = function () {
	var reVal = [];
	var selected = this.getSelected();
	for (var i = 0; i < selected.length; i++) {
		reVal.push(this.getRow(selected[i]));
	}
	return reVal;
}

sidebarMultiSelect.prototype.getRows = function () {
	var reVal = [];
	var selected = this.getSelected();
	for (var data in this.row) {
		reVal.push(this.row[data]);
	}
	return reVal;
}

sidebarMultiSelect.prototype.getRow = function (id) {
	return this.row[id];
}


sidebarMultiSelect.prototype.clear = function () {
	//this._parent.find(".sidebar-botton").html("全选");
	this._parent.find("ul>li .active").each(function (i) {
		$(this).removeClass("active");
	});
}



sidebarMultiSelect.prototype._init = function (jq) {
	this._parent = jq;
	var opition = this._parent.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._params = showObj.params || {};
	this._createbody();
}

sidebarMultiSelect.prototype.selectAll = function () {
	//this._parent.find(".sidebar-botton").html("全不选");
	this._parent.find("ul>li>label").each(function (i) {
		$(this).addClass("active");
	});
}

sidebarMultiSelect.prototype._createbody = function () {
	this.row = {};
	var me = this;
	var parent = this._parent;
	parent.addClass("map-data-list base-data");
	parent.empty();
	if (me._json) {
		var isMultiSelect = me._json.isMultiSelect == undefined ? true : me._json.isMultiSelect;
		this._isMultiSelect = isMultiSelect;
		var expand = me._json.expand == undefined ? false : me._json.expand;
		var onClickMethod = commonTool.isFunction(me._json["click"]) ? me._json["click"] : "";
		var onExpendMethod = commonTool.isFunction(me._json["expend"]) ? me._json["expend"] : "";
		var a;
		if (expand) {
			parent.addClass('active');
		}
		a = $("<a class='data-header dcjq-parent' title='" + me._json.title + "'>" + me._json.title + "</a>");
		a.appendTo(parent);
		if (me._json.id) {
			a.attr("id", me._json.id);
			a.data("sideObj", this);
		};
		var dataHeaderClick = function () {
			if (parent.hasClass("active")) {
				parent.removeClass("active");
			} else {
				$(".sidebar-multiSelect").removeClass("active");
				$(".sidebar-multiSelectTree").removeClass("active");
				parent.addClass("active");
			}
			if (onExpendMethod) onExpendMethod(me);
			return false;
		};
		a.on("click", dataHeaderClick);
		// if (isMultiSelect) {
		// 	var div01 = $('<span class="sidebar-botton">全选</span>');
		// 	div01.bind("click", function () {
		// 		if ($(this).html() == "全不选") {
		// 			$(this).html("全选");
		// 			me.clear();
		// 		} else {
		// 			$(this).html("全不选");
		// 			me.selectAll();
		// 		}
		// 		if (onClickMethod) onClickMethod(me);
		// 		return false;
		// 	});
		// 	div01.appendTo(a);
		// }
		var spanDown = $("<span class='fa fa-caret-right' />");
		spanDown.appendTo(a);


		if (me._json.url) {
			$.ajax({
				url: me._json.url,
				type: me._json.type || "POST",
				data: me._params,
				success: function (datas) {
					var datasJson = datas;
					if (!commonTool.isArray(datas)) {
						datasJson = JSON.parse(datas);
					}
					var ul = $("<ul class='sidebar-melteSelect-hidden'>");
					ul.appendTo(parent);
					var liClick = function (e) {
						e = e || event;
						if (this.tagName == "LI") {
							var tag = $(this).children().eq(0);
							if(tag.hasClass("selectAll")){
								if(tag.hasClass("active")){
									me.clear();
								}else{
									me.selectAll();
								}
								if (onClickMethod) onClickMethod(me, b);
								return false;
							}
							if (tag.hasClass("m-radio")) {
								me.clear();
							}
							tag.toggleClass("active");

							if (me.getSelected().length == 0) {
								me.clear();
							}
							if (me.getSelected().length == me.getAll().length) {
								me.selectAll();
							}else{
								parent.find(".selectAll").removeClass("active");
							}

							var b = tag.hasClass("active");
							if (onClickMethod) onClickMethod(me, b);
							return false;
						}

					};
					var labelClick = function (e) {
						e = e || event;
						if (this.tagName == "LABEL") {
							if ($(e.target).is("input")) return;
							var tag = $(this);
							if(tag.hasClass("selectAll")){
								if(tag.hasClass("active")){
									me.clear();
								}else{
									me.selectAll();
								}
								if (onClickMethod) onClickMethod(me, b);
								return false;
							}
							if (tag.hasClass("m-radio")) {
								me.clear();
							}
							tag.toggleClass("active");
							if (me.getSelected().length == 0) {
								me.clear();
							}
							if (me.getSelected().length == me.getAll().length) {
								me.selectAll();
							}else{
								parent.find(".selectAll").removeClass("active");
							}
							var b = tag.hasClass("active");
							if (onClickMethod) onClickMethod(me, b);
							return false;
						}
					};

					var radioName = me._json.id || commonTool.uuid();
					if (isMultiSelect) {
						var li = $("<li/>");
						li.appendTo(ul);
						li.on("click", liClick);
						var label = $("<label class='check-info m-checkbox selectAll' />");
						var checked = $("<input type='checkbox'/>");
						label.appendTo(li);
						label.on("click", labelClick);
						checked.appendTo(label);
						var ii = $("<i/>");
						ii.appendTo(label);
						var span = $("<span title='全选'>全选</span>");
						span.appendTo(label);
					}
					for (var i = 0; i < datasJson.length; i++) {
						var dataJson = datasJson[i];
						me.row[dataJson.id] = dataJson;
						var li = $("<li/>");
						li.appendTo(ul);
						li.on("click", liClick);
						li.data("data", dataJson);

						var label;

						var checked;
						if (isMultiSelect) {
							label = $("<label class='check-info m-checkbox' />");
							checked = $("<input type='checkbox'/>");
						} else {
							label = $("<label class='check-info m-checkbox m-radio'/>");
							checked = $("<input type='radio' name='" + radioName + "'/>");
						}
						label.appendTo(li);
						label.data("data", dataJson);
						label.on("click", labelClick);
						checked.appendTo(label);
						var ii = $("<i/>");
						ii.appendTo(label);
						var span = $("<span title='" + dataJson.name + "'>" + dataJson.name + "</span>");
						span.appendTo(label);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
		}
	}
}



var sidebarToggle = function (jq) {
	this._init(jq);
}

sidebarToggle.prototype.clear = function () {
	this._parent.find(".toggle-close-btn").addClass("toggle-open-btn fa-toggle-on");
	this._parent.find(".toggle-close-btn").removeClass("toggle-close-btn fa-toggle-off");
}


sidebarToggle.prototype.getSelected = function () {
	var reVal = [];
	for (var key in this._selects) {
		if (this._selects[key]) {
			reVal.push(key);
		}
	}
	return reVal;
}

sidebarToggle.prototype._init = function (jq) {
	this._parent = jq;
	this._selects = {};
	this._createbody();
}

sidebarToggle.prototype._createbody = function () {
	var me = this;
	var parent = this._parent;
	parent.empty();
	var opition = this._parent.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	if (showObj.url) {
		$.ajax({
			url: showObj.url,
			type: showObj.type || "POST",
			data: showObj.params || {},
			success: function (datas) {
				var json = JSON.parse(datas);
				me._json = json;
				var ul = $("<ul class='sidebarToggle'>");
				ul.appendTo(parent);
				if (showObj.id) {
					ul.attr("id", showObj.id);
					ul.data("sideObj", this)
				};
				var onClickMethod = showObj["click"];
				for (var i = 0; i < json.length; i++) {
					var obj = json[i];
					me._selects[obj.id] = true;
					var li = $("<li title='" + obj.name + "'>");
					li.appendTo(ul);
					var img = $("<img src='" + obj.icon + "' width='20px' height='20px'>");
					img.appendTo(li);
					var span = $("<span class='sidebarToggleSpan'>" + obj.name + "</span>");
					span.appendTo(li);
					var ii = $("<i id='" + obj.id + "' class='toggle-btn fa toggle-open-btn fa-toggle-on'/>");
					ii.appendTo(li);
					ii.data("sideId", obj.id);
					ii.bind("click", function () {
						if ($(this).hasClass("fa-toggle-on")) {
							me._selects[$(this).data("sideId")] = false;
							$(this).removeClass("toggle-open-btn fa-toggle-on");
							$(this).addClass("toggle-close-btn fa-toggle-off");
							if (onClickMethod instanceof Function) {
								onClickMethod(me, json[i], false);
							}
						} else {
							me._selects[$(this).data("sideId")] = true;
							$(this).removeClass("toggle-close-btn fa-toggle-off");
							$(this).addClass("toggle-open-btn fa-toggle-on");
							if (onClickMethod instanceof Function) {
								onClickMethod(me, json[i], true);
							}
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	}
}

var sidebarTable = function (jq) {
	this._init(jq);
}

sidebarTable.prototype.clear = function () {
	this._parent.find(".sidebartr-select").removeClass("sidebartr-select");
	this._parent.find("table").eq(0).children().eq(1).find("tr").each(function (i) {
		$(this).removeClass("unshow");
	});
}

sidebarTable.prototype.reload = function (params) {
	this._parent.empty();
	if (params) {
		var params2 = $.extend({}, this._json.params || {});
		this._params = $.extend(params2, params);
	}
	this._createbody();
}

sidebarTable.prototype._init = function (jq) {
	this._parent = jq;
	var opition = this._parent.attr("option");
	this._opition = opition;
	var json = showType[opition];
	this._json = json;
	this._id = json.id;
	this._url = json.url;
	this._params = json.params || {};
	this._title = json.title || "";
	this._type = json.type || "POST";
	this._click = json.click;
	this._createbody();
}

sidebarTable.prototype._createbody = function () {
	var parent = this._parent;
	var me = this;
	parent.empty();
	var table = $("<table class='m-table table-bordered table-info sidebarTable'>");
	table.appendTo(parent);
	this._table = table;
	if (this._id) {
		table.attr("id", this._id);
		table.data("sideObj", this);
	};
	var thead = $("<thead>");
	thead.appendTo(table);
	var tr = $("<tr>");
	tr.appendTo(thead);
	var th = $("<th class='sidebar-table-th showdata'>" + this._title + "</th>");
	th.appendTo(tr);
	var thClick = function () {
		if ($(this).hasClass("showdata")) {
			$(this).removeClass("showdata");
			$(this).parent().parent().parent().children().eq(1).removeClass("tableshow");
		} else {
			$(this).addClass("showdata");
			$(this).parent().parent().parent().children().eq(1).addClass("tableshow");
		}
		return false;
	};
	th.on("click", thClick);
	var spanDown = $("<span class='fa fa-angle-down' />");
	spanDown.appendTo(th);
	var clickFun = this._click;
	if (this._url) {
		$.ajax({
			url: this._url,
			type: this._type,
			data: this._params,
			success: function (datas) {
				var datasJson = JSON.parse(datas);
				var tbody = $("<tbody  class='sidebar-table-body tableshow'>");
				tbody.appendTo(table);
				for (var i = 0; i < datasJson.length; i++) {
					var dataJson = datasJson[i];
					var tr2 = $("<tr>");
					tr2.appendTo(tbody);
					var td2 = $("<td>" + dataJson.name + "</td>");
					td2.appendTo(tr2);
					tr2.data("datas", dataJson);
					if (clickFun instanceof Function) {
						tr2.on("click", function () {
							$(this).parent().children().removeClass("sidebartr-select")
							$(this).addClass("sidebartr-select");
							clickFun(me, $(this).data("datas"));
						});
					}
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	}
}


/**
 * createBy xwx 20190402
 * 查询条+展示页面
 * 
 * id			查询框id
 * searchUrl 	查询接口
 * viewUrl		页面接口
 * left			左移,默认10
 * top			下移默认10
 * searchFun	额外查询方法
 * clickFun		额外点击方法
 */
function SearchViewControl(id, searchUrl, viewUrl, left, top, searchFun, clickFun, clearFun,placeholder,namekey) {
	var defaultVal ={
		id: commonTool.uuid,
		left:10,
		top:10
	}
	//this.options=$.extend(defaultVal,data);
	placeholder=placeholder||'搜索老字号';
	left = left ? left : 10;
	top = top ? top : 10;
	// 默认停靠位置和偏移量
	this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	this.defaultOffset = new BMap.Size(left, top);
	this.id = id;
	this.searchUrl = searchUrl;
	this.viewUrl = viewUrl;
	this.searchFun = searchFun;
	this.clickFun = clickFun;
	this.clearFun = clearFun;
	this.left = left;
	this.top = top;
	this.placeholder = placeholder;
	this.namekey=namekey||'name';
}

SearchViewControl.prototype = new BMap.Control();


SearchViewControl.prototype.initialize = function (map) {
	var div = document.createElement("div");
	var search = this.createSearchBox();
	$(div).append(search);
	var view = this.createView();
	$(div).append(view);
	// 添加DOM元素到地图中
	map.getContainer().appendChild(div);
	// 将DOM元素返回
	return div;
}

SearchViewControl.prototype.createView = function () {
	var me = this;
	var view = $("<div class='baidu-search-hidden baidu-search-view unshow'>");
	me.view = view;
	me.resetView();
	$(window).resize(function () {
		me.resetView();
	});
	return view;
}

SearchViewControl.prototype.resetView = function () {
	var me = this;
	var view = me.view;
	var height = $(window).height();
	var size = parseInt($("html").css("font-size"));
	var h = height - me.top - 3.5 * size;
	me.view.css("height", h + "px");
	me.view.children("baidu-search-view-body").css("height", h + "px");
}


SearchViewControl.prototype.createSearchBox = function () {
	var me = this;
	var searchFun = function () {
		if (!me.getValue()) return;
		if (me.searchFun) me.searchFun(me);
		me.clear.parent().addClass("clear");
		me.loadSearchData();
	}
	var search = $('<div id="searchView" class="searchbox">');
	var input = $('<input class="baidu-search" autocomplete="off" placeholder="'+me.placeholder+'" title="'+me.placeholder+'" id="' + me.id + '">');
	input.bind("keydown", function (event) {
		event = event || window.event;
		if (event.keyCode == 13) searchFun();
	})


	/*//自动关联
	var fun=function(){
		me.loadSearchData();
	}
	commonTool.bindInputChange(input,fun);*/
	search.append(input);
	this.input = input;
	var clear = $('<div class="baidu-search-clear" title="清除">');
	clear.click(function () {
		me.empty();
		if (me.clearFun) me.clearFun(me);
	});
	this.clear = clear;
	search.append(clear);
	var button = $('<button title="搜索" class="baidu-search-btn"></button>');
	search.append(button);
	button.on("click", searchFun);
	var ul = $("<ul class='baidu-search-hidden unshow'>");
	search.append(ul);
	this.dataUl = ul;
	return search;
}

SearchViewControl.prototype.empty = function () {
	this.hideView();
	this.hideUl();
	this.input.val("");
	this.clear.parent().removeClass("clear");
}

SearchViewControl.prototype.getValue = function () {
	return this.input.val();
}

SearchViewControl.prototype.loadSearchData = function () {
	var ul = this.dataUl;
	var me = this;
	var namekey =this.namekey;
	ul.empty();
	ul.removeClass("unshow");
	me.hideView();
	var key = encodeURIComponent(encodeURIComponent(this.input.val()));
	if (key) {
		$.post(this.searchUrl, { key: key, pageIndex: 0, pageSize: 20 }, function (data) {
			data = eval(data);
			for (var i = 0; i < data.length; i++) {
				var li = $("<li>");
				li.appendTo(ul);
				var _data = data[i];
				li.data("data", _data);
				var span1 = $("<span>" + _data[namekey] + "</span>");
				span1.appendTo(li);
				li.bind("click", function () {
					var data = $(this).data("data");
					me.input.val(data[me.namekey]);
					if (me.viewUrl) {
						me.loadView(data["id"]);
					}
					me.hideUl();
					if (me.clickFun) me.clickFun(data);
				});
			}
		});
	}
}

function bindClick(me, li, _data) {

}

SearchViewControl.prototype.hideUl = function () {
	var ul = this.dataUl;
	ul.empty();
	ul.addClass("unshow");
}

SearchViewControl.prototype.loadView = function (id) {
	var me = this;
	var view = me.view;
	me.hideUl();
	if (me.viewUrl) {
		$.post(me.viewUrl, { id: id }, function (data) {
			view.empty();
			var body = $("<div class='baidu-search-view-body'>");
			var div = $("<div class='baidu-search-view-contains'>");
			div.html(data);
			body.append(div);
			view.append(body);
			view.removeClass("unshow");
		});
	}
}

SearchViewControl.prototype.hideView = function () {
	var view = this.view;
	view.empty();
	view.addClass("unshow");
}


var sidebarMultiSelectTree = function (jq) {
	this._init(jq);
}

sidebarMultiSelectTree.prototype._init = function (jq) {
	this._parent = jq;
	var opition = this._parent.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._params = showObj.params || {};
	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this._createbody();
}

sidebarMultiSelectTree.prototype._createbody = function () {
	this.row = {};
	var me = this;
	var parent = this._parent;
	parent.addClass("map-data-list base-data");
	parent.empty();
	if (me._json) {
		var isMultiSelect = me._json.isMultiSelect == undefined ? true : me._json.isMultiSelect;
		this._isMultiSelect = isMultiSelect;
		var expand = (me._json.expand === true ? true : false);
		var onClickMethod = commonTool.isFunction(me._json["click"]) ? me._json["click"] : "";
		var onExpendMethod = commonTool.isFunction(me._json["expend"]) ? me._json["expend"] : "";
		var a;
		if (expand) {
			parent.addClass('active');
		}
		a = $("<a class='data-header dcjq-parent' title='" + me._json.title + "'>" + me._json.title + "</a>");
		a.appendTo(parent);
		if (me._json.id) {
			a.attr("id", me._json.id);
			a.data("sideObj", this);
		};
		var dataHeaderClick = function () {
			if (parent.hasClass("active")) {
				parent.removeClass("active");
			} else {
				$(".sidebar-multiSelect").removeClass("active");
				$(".sidebar-multiSelectTree").removeClass("active");
				parent.addClass("active");
			}
			if (onExpendMethod) onExpendMethod(me);
			return false;
		};
		a.on("click", dataHeaderClick);
		// if(isMultiSelect){
		// 	var div01=$('<span class="sidebar-botton">全选</span>');
		// 	div01.bind("click",function(){
		// 		if($(this).html()=="全不选"){
		// 			$(this).html("全选");
		// 			me.clear();
		// 		}else{
		// 			$(this).html("全不选");
		// 			me.selectAll();
		// 		}
		// 		if(onClickMethod) onClickMethod(me);
		// 		return false;
		// 	});
		// 	div01.appendTo(a);
		// }
		var spanDown = $("<span class='fa fa-caret-right' />");
		spanDown.appendTo(a);


		if (me._json.url) {
			$.ajax({
				url: me._json.url,
				type: me._json.type || "POST",
				data: me._params,
				success: function (datas) {
					var datasJson = datas;
					if (!commonTool.isArray(datas)) {
						datasJson = JSON.parse(datas);
					}
					var ul = me.buildUl(datasJson);
					ul.addClass("sidebar-melteSelect-hidden");
					parent.append(ul);
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
		}
	}
}

sidebarMultiSelectTree.prototype.clickAll = function () {
	var flag = this._parent.find(".sidebar-full").eq(0).hasClass("sidebar-open");
	if (flag) {
		this.clearAll();
	} else {
		this.selectAll();
	}
}

sidebarMultiSelectTree.prototype.selectAll = function () {
	this._parent.find(".sidebar-full").each(function () {
		$(this).addClass("sidebar-open");
	});
}

sidebarMultiSelectTree.prototype.clearAll = function () {
	this._parent.find(".sidebar-full").each(function () {
		$(this).removeClass("sidebar-open");
	});
}

sidebarMultiSelectTree.prototype.clickRow = function (id) {
	var dom = this._parent.find("#" + id).eq(0);
	if (dom) {
		var flag = dom.children(".sidebar-full").hasClass("sidebar-open");
		if (flag) {
			this.clearRow(id);
		} else {
			this.selectRow(id);
		}
	}
}

sidebarMultiSelectTree.prototype.selectRow = function (id) {
	var dom = this._parent.find("#" + id).eq(0);
	if (dom) {
		if (this._isMultiSelect) {
			dom.find(".sidebar-full").each(function () {
				$(this).addClass("sidebar-open");
			});
			var flag = true;
			while (id.lastIndexOf("-") > -1) {
				id = id.substr(0, id.lastIndexOf("-"));
				if (flag) {
					$("#" + id).find(".sidebar-ul").find(".sidebar-full").each(function () {
						if (!$(this).hasClass("sidebar-open")) {
							flag = false;
							return false;
						}
					});
				}
				if (flag) $("#" + id).children(".sidebar-full").addClass("sidebar-open");
			}
			if (flag) {
				this._parent.find(".sidebar-full").each(function (i) {
					if (i > 0 && !$(this).hasClass("sidebar-open")) {
						flag = false;
						return false;
					}
				});
				if (flag) this._parent.find(".sidebar-full").eq(0).addClass("sidebar-open");
			}
		} else {
			if (dom.find(".sidebar-full").length == 1) dom.children(".sidebar-full").addClass("sidebar-open");
		}
	}
}

sidebarMultiSelectTree.prototype.clearRow = function (id) {
	var dom = this._parent.find("#" + id).eq(0);
	if (dom) {
		if (this._isMultiSelect) {
			dom.find(".sidebar-full").each(function () {
				$(this).removeClass("sidebar-open");
			});
			while (id.lastIndexOf("-") > -1) {
				id = id.substr(0, id.lastIndexOf("-"));
				$("#" + id).children(".sidebar-full").removeClass("sidebar-open");
			}
			$("#" + id + "-0").children(".sidebar-full").removeClass("sidebar-open");
		} else {
			if (dom.find(".sidebar-full").length == 1) dom.children(".sidebar-full").removeClass("sidebar-open");
		}
	}
}

sidebarMultiSelectTree.prototype.rowClick = function (e) {
	e = e || window.event;
	var dom = e.target;
	var json = this._json;
	if (!$(dom).hasClass("sidebar-full")) dom = $(dom).parent()[0];
	var dataId = $(dom).attr("data-id");
	var id = $(dom).parent().attr("id");
	if (dataId == "sidebar-total") {//全选
		this.clickAll();
	} else {
		this.clickRow(id);
	}
	if (commonTool.isFunction(json.click)) json.click();
}

sidebarMultiSelectTree.prototype.buildUl = function (datas, leve, pid) {
	var me = this;
	pid = pid || this._id;
	leve=leve||0;
	var ul = $("<ul class='sidebar-ul'>");
	if (leve % 2 == 1) ul.addClass("skin2");
	if (leve == 0 && this._isMultiSelect) {
		datas.splice(0, 0, {
			"id": "sidebar-total",
			"name": "全部"
		});
	}
	if (commonTool.isArray(datas)) {
		for (var i = 0; i < datas.length; i++) {
			var cId = pid + "-" + i;
			var li = $("<li id='" + cId + "' class='sidebar-li' >");
			var data = datas[i];
			var a = $("<span class='sidebar-li-a' >");
			a.html(data.name);
			var img = $("<span class='sidebar-li-i'>");
			var div = $("<div class='sidebar-full' data-id='" + data.id + "'>");
			li.append(div);
			div.append(img);
			div.append(a);
			div.bind("click", function (e) {
				me.rowClick(e);
			});
			if (commonTool.isArray(data.children) && data.children.length > 0) {
				var cul = this.buildUl(data.children, leve + 1, cId);
				li.append(cul);
			} else {
				div.addClass("end-child");
				div.data("data", data);
			}
			ul.append(li);
		}
	}
	return ul;
}



sidebarMultiSelectTree.prototype.reload = function (params) {
	this._parent.empty();
	if (params) {
		var params2 = $.extend({}, this._json.params || {});
		this._params = $.extend(params2, params);
	}
	this._createbody();
}

sidebarMultiSelectTree.prototype.getSelected = function (showParent) {
	showParent=(showParent === true ? true:false);
	var reVal = [];
	if(showParent){
		this._parent.find(".sidebar-full.sidebar-open.end-child").each(function (i) {
			var id = $(this).attr("data-id");
			if (id != 'sidebar-total') {
				reVal.push(id);
			}
		});
	}else{
		this._parent.find(".sidebar-full.sidebar-open").each(function (i) {
			var id = $(this).attr("data-id");
			if (id != 'sidebar-total') {
				reVal.push(id);
			}
		});
	}
	
	return reVal;
}

sidebarMultiSelectTree.prototype.getSelectRows = function () {
	var reVal = [];
	this._parent.find(".sidebar-full.sidebar-open.end-child").each(function (i) {
		var id = $(this).data("data");
		if (id != 'sidebar-total') {
			reVal.push(id);
		}
	});
	return reVal;
}

sidebarMultiSelectTree.prototype.getAll = function () {
	var reVal = [];
	this._parent.find(".sidebar-full.end-child").each(function (i) {
		var id = $(this).attr("data-id");
		if (id != 'sidebar-total') {
			reVal.push(id);
		}
	});
	return reVal;
}


sidebarMultiSelectTree.prototype.setValue = function (value) {
	value = value || "";
	var ids = value.split(",");
	var me = this;
	this._parent.find(".sidebar-full.end-child").each(function (i) {
		var jq = $(this);
		var id = jq.attr("data-id");
		if (ids.indexOf(id)>-1) {
			me.selectRow(jq.parent().attr("id"));
			return;
		}
	});
}

sidebarMultiSelectTree.prototype.setValues = function (value) {
	this.clear();
	this.setValue(value);
}


sidebarMultiSelectTree.prototype.clear = function () {
	this._parent.find(".sidebar-full").each(function () {
		$(this).removeClass("sidebar-open");
	});
}

var sidebarPageTable = function (jq) {
	this._init(jq);
}



sidebarPageTable.prototype._init = function (jq) {
	this._parent = jq;
	var opition = jq.attr("option");
	this._opition = opition;
	var showObj = showType[opition];
	this._json = showObj;
	this._pageIndex =showObj.pageIndex||0;
	this._pageSize =showObj.pageSize||6;
	this._total =0;
	this._totalSize =0;
	this.params = showObj.params || {};//默认值

	if (showObj) {
		this._id = showObj.id || commonTool.uuid();
	} else {
		this._id = commonTool.uuid();
	}
	this._createbody();
	this._reload();
}
sidebarPageTable.prototype.reloadData = function (data) {
	this._tempData=data||{};//查询参数
	this._reload();
	
}

sidebarPageTable.prototype._reload = function () {
	var me = this;
	var json = this._json;
	var tempData=this._tempData;
	if (json.url) {
		var url = json.url;
		var type = json.type || "POST";
		var params = json.params || {};
		if(tempData&&(tempData.pageIndex||tempData.pageIndex === 0)) this._pageIndex = tempData.pageIndex;
		params=$.extend(params,{'pageIndex':this._pageIndex,'pageSize':this._pageSize},tempData);
		$.ajax({
			url: url,
			type: type,
			data: params,
			success: function (datas) {
				if (datas&&commonTool.isString(datas)) datas = JSON.parse(datas);
				var pageSize=me._pageSize;
				me._total=datas.totalCount;
				me._totalSize=datas.totalPage;
				me._loadTable(datas.datalist);
			},
			fail: function(){
				me._total=0;
				me._totalSize=0;
				me.__pageIndex=0;
				me._loadTable([]);
			}
		});
	} else if (json.datas) {
		//暂不支持
	}
}


sidebarPageTable.prototype._loadTable = function(datas){
	var content=this._content;
	var pageIndex =this._pageIndex;
	var pageSize=this._pageSize;
	var total=this._total;
	var totalSize=this._totalSize;
	var clickFun=this._json.click;
	var nameKey=this._json.nameKey||'name';
	content.empty();
	var val=parseInt(this._pageIndexInput.val());
	if(val!=pageIndex+1)  this._pageIndexInput.val(pageIndex+1);
	if(pageSize==0) this._pageIndexInput.val(0);
	this._totalPage.text("/"+totalSize);
	if(pageIndex>0){
		this._firstPage.removeClass('unavailable');
		this._previousPage.removeClass('unavailable');
	}else{
		this._firstPage.addClass('unavailable');
		this._previousPage.addClass('unavailable');
	}
	
	if(pageIndex<totalSize-1){
		this._nextPage.removeClass('unavailable');
		this._lastPage.removeClass('unavailable');
	}else{
		this._nextPage.addClass('unavailable');
		this._lastPage.addClass('unavailable');
	}
	
	if(commonTool.isArray(datas)){
		var maxNum=(datas.length<pageSize?datas.length:pageSize);
		for(var i=0;i<maxNum;i++){
			var data = datas[i];
			var li = $('<li>');
			li.text(data[nameKey]||"");
			content.append(li);
			if(clickFun&&commonTool.isFunction(clickFun)) this._bindClick(li,data,clickFun);
		}
	}
}

sidebarPageTable.prototype._bindClick=function(li,data,clickFun){
	if(li&&commonTool.isFunction(clickFun)) {
		li.on("click",function(){
			clickFun(data);
		});
	}
}


sidebarPageTable.prototype._createbody = function () {
	var me =this;
	var parent = me._parent;
	parent.empty();
	var content=$('<div class="left-content">');
	parent.append(content);
	this._content=content;
	var paging =$('<div class="market-page">');
	parent.append(paging);
	var firstPage = $('<i class="fa fa-angle-double-left unavailable" aria-hidden="true">');
	firstPage.on("click",function(){
		if($(this).hasClass("unavailable")) return false;
		if(me._pageIndex>0){
			me._pageIndex=0;
			me._reload();			
		}
	});
	paging.append(firstPage);
	this._firstPage = firstPage;
	
	var previousPage = $('<i class="fa fa-angle-left unavailable" aria-hidden="true">');
	previousPage.on("click",function(){
		if($(this).hasClass("unavailable")) return false;
		if(me._pageIndex>0){			
			me._pageIndex--;
			me._reload();
		}
	});
	paging.append(previousPage);
	this._previousPage = previousPage;
	
	var pageIndexInput = $('<input type="text" class="sidebar-pageIndex pageSkip" value="'+this._pageIndex+'">');
	pageIndexInput.bind("keydown", function (event) {
		event = event || window.event;
		if (event.keyCode == 13){
			var val=parseInt(me._pageIndexInput.val())||1;
			val--;
			var totalSize = me._totalSize;
			if(totalSize>val){
				me._pageIndex=val;
				me._pageIndexInput.val(val+1);
				me._reload();
			}else{
				me._pageIndex=totalSize-1;
				me._pageIndexInput.val(totalSize);
				me._reload();
			}
		}
	});
	paging.append(pageIndexInput);
	this._pageIndexInput = pageIndexInput;
	
	var totalPage = $('<span class="sidebar-totalPage">');
	paging.append(totalPage);
	totalPage.text("/0")
	this._totalPage = totalPage;
	
	var nextPage = $('<i class="fa fa-angle-right unavailable" aria-hidden="true">');
	nextPage.on("click",function(){
		if($(this).hasClass("unavailable")) return false;
		if(me._pageIndex<me._totalSize) {
			me._pageIndex++;
			me._reload();
		}
	});
	paging.append(nextPage);
	this._nextPage = nextPage;
	
	var lastPage = $('<i class="fa fa-angle-double-right unavailable" aria-hidden="true">');
	lastPage.on("click",function(){
		if($(this).hasClass("unavailable")) return false;
		if(me._pageIndex<me._totalSize) {
			me._pageIndex=me._totalSize-1;
			me._reload();
		}
	});
	paging.append(lastPage);
	this._lastPage = lastPage;
	
}
