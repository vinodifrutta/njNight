var domJsFun = function() {
	// 百度地图
	var map;
	// 网点
	var markerClusterer;
	
	
	
	var isLoading =false;
	var loadingNum = 0;
	var showLoading =function(){
		if(!isLoading){
			++loadingNum;
			isLoading =true;
			$(".m-loading").removeClass("unshow");
			return loadingNum;
		}
		return -1;
	}
	var hideLoading = function(num) {
		console.log(num);
		if (num == loadingNum) {
			$(".m-loading").addClass("unshow");
			isLoading = false;
		}
	}

	var reloadMap = function() {
		clearMap();
		//var index=showLoading();
		// var indClassObj = $("#indClass").sidebarGet();
		// var indClass = indClassObj
		// 		&& (indClassObj.getSelected(true).join(",") || indClassObj
		// 				.getAll(true).join(",")) || "";
		// var adminDiv = $("#adminDiv").sidebarGet()
		// 		&& $("#adminDiv").sidebarGet().getSelected().join(",") || '';
		// var busArea = $("#busArea").sidebarGet()
		// 		&& $("#busArea").sidebarGet().getSelected().join(",") || '';
		var data = JSON.parse(getUrlParameter('data'));

		var bs = map.getBounds(); //获取可视区域
		var bssw = bs.getSouthWest(); //可视区域左下角
		var bsne = bs.getNorthEast(); //可视区域右上角
		$.ajax({
			url : staticurl + '/MarketEnt/getMapMsg?',
			type : 'POST',
			async:false,
			data : {
				minlatitude: bssw.lat,
				minlongitude: bssw.lng,
				maxlatitude: bsne.lat,
				maxlongitude: bsne.lng,
				indClass : data.indClass||'',
				adminDiv : data.adminDiv||''
			},
			success : function(data) {
				if (commonTool.isString(data))
					data = JSON.parse(data);
				reloadMapMarker(data);
				
				//hideLoading(index);
			},
			error : function() {
				console.log("a2");
				//hideLoading(index);
			}
		});
	}

	var clearMap = function() {
		if (markerClusterer)
			markerClusterer.clearMarkers();
	}

	var reloadMapMarker = function(data) {
		if (!data)
			return;
		var maxZoom = 15;
		var zoom = map.getZoom();
		var markers = [];
		if (!markerClusterer)
			markerClusterer = new BMapLib.MarkerClusterer(map, {
				markers : [],
				maxZoom : maxZoom,
				minClusterSize : 1
			});
		data.forEach(function(overlay, i) {
			var marker = MapDrawingHelpTool.createMarkerByEnt(overlay, i, true);
			if (marker)
				markers.push(marker);
		});
		markerClusterer.redraw(markers);
	}

	
	

	var createMap = function() {
		map = new BMap.Map("mapContainer", {
			minZoom : 9,
			maxZoom : 18,
			enableMapClick : false,
			drawMargin : 100,
			drawer : BMAP_SVG_DRAWER_FIRST
		}); // 创建Map实例,设置地图允许的最小/大级别
		// 创建地图实例 
		var point = new BMap.Point(118.49430492627914, 31.980852263059017);
		// 创建点坐标  
		map.centerAndZoom(point, 11);
		// 初始化地图，设置中心点坐标和地图级别  
		map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
		map.disableDoubleClickZoom();
		var mapStyle = {
			styleJson : [ {
				"featureType" : "all",
				"elementType" : "all",
				"stylers" : {
					"lightness" : 10,
					"saturation" : -100
				}
			} ]
		};
		map.setMapStyle(mapStyle);
		map.addEventListener('zoomend', mapZoomend);
		map.addEventListener('moveend', mapZoomend);
	}

	var mapZoomend = function() {
		reloadMap();
	}

	var createDivisions = function() {
		var bdary = new BMap.Boundary();
		bdary.get('南京', createDivision2);
		$.ajax({
			url : staticurl + '/common/getDictTree?',
			type : 'POST',
			data : "level=1&code=NANJING",
			success : function(data) {
				if (null != data) {
					var dataJson = eval('(' + data + ')');
					for (var i = 0; i < dataJson.length; i++) {
						if (i + 1 == dataJson.length) {
							createDivisionLast(bdary, dataJson[i]);
						} else {
							createDivision(bdary, dataJson[i]);
						}
					}
				}
			}
		});

	}

	var createDivision2 = function(rs) {
		var count = rs.boundaries.length; //行政区域的点有多少个
		for (var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], divisionStyle); //建立多边形覆盖物
			ply.disableMassClear();
			map.addOverlay(ply); //添加覆盖物
		}
	}

	var createDivisionLast = function(bdary, address) {
		var fun = function(rs) {
			var count = rs.boundaries.length; //行政区域的点有多少个
			for (var i = 0; i < count; i++) {
				var ply = new BMap.Polygon(rs.boundaries[i], divisionStyle2); //建立多边形覆盖物
				ply.disableMassClear();
				map.addOverlay(ply); //添加覆盖物
				ply.adminDiv = address;
			}

		};

		bdary.get("南京" + address.NAME, fun);
	}
	var createDivision = function(bdary, address) {
		var fun = function(rs) {
			var count = rs.boundaries.length; //行政区域的点有多少个
			for (var i = 0; i < count; i++) {
				var ply = new BMap.Polygon(rs.boundaries[i], divisionStyle2); //建立多边形覆盖物
				ply.disableMassClear();
				map.addOverlay(ply); //添加覆盖物
				ply.adminDiv = address;
			}
		};
		bdary.get("南京" + address.NAME, fun);
	}
	return {
		init : function() {
			createMap();
			createDivisions();//划南京
			mapZoomend();
		},
		toAdd: function(){
			var zoom = map.getZoom()-1;
			if(zoom>=10) map.setZoom(zoom);
		},
		toPrep: function(){
			var zoom = map.getZoom()+1;
			if(zoom<=18) map.setZoom(zoom);
		},
		toSift: function(){
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function (e) {
				if (this.getStatus() == BMAP_STATUS_SUCCESS) {
					map.panTo(e.point);
				} else {
					alert("获取定位失败");
				}
			});
		}
	}
}

var domJs = domJsFun();


$(document).ready(function() {
	domJs.init();
})