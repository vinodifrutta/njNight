function checkNull(obj){
	if(obj==undefined||obj==null||obj==""||obj=="null"){
		return true;
	}
	return false;
}

var MapDrawingHelpTool={
};

MapDrawingHelpTool.setLabelFont=function(map){
	var zoom=map.getZoom();
   	var labelStyles=labelOpts["labelStyle_"+zoom];
   	if(labelStyles){
	   	for(var i=0;i<labelStyles.length;i++){
	   		var labelStyle=labelStyles[i];
	   		var labels=getClassName(labelStyle["className"]);
	   		for(var j=0;j<labels.length;j++){
	   			var label=labels[j];
	   			label.style.fontSize=labelStyle["size"];
	   		}
	   	}
   	}
}

MapDrawingHelpTool.createMarkerByLzhEnt=function(data,h){
	var id=data.id;
	if (checkNull(data.longitude) || checkNull(data.latitude) || checkNull(data.name) || checkNull(data.icon)) return null;
	var pt = new BMap.Point(data.longitude, data.latitude);
	var myIcon = new BMap.Icon(data.icon, new BMap.Size(30, 48));
	myIcon.setImageSize(new BMap.Size(30, 48));
	var marker = new BMap.Marker(pt, {
		icon : myIcon
	}); // 创建标注
	marker.setTitle(data.name);
	marker.mydata = cloneObj(eval(data));
	return marker;
}


MapDrawingHelpTool.createMarkerByEnt=function(data,h,canClick){
	canClick=canClick===false?false:true;
	let id = data.ent_id||data.entId;
	var entName = data.ent_name||data.entName;
	var icon = data.icon;
	if (checkNull(data.longitude) || checkNull(data.latitude)
			|| checkNull(entName) || checkNull(icon))
		return null;
	var pt = new BMap.Point(data.longitude, data.latitude);
	var myIcon = new BMap.Icon(data.icon, new BMap.Size(20, 20));
	myIcon.setImageSize(new BMap.Size(20, 20));
	var color=data.iconColor;
	if(!color||color==null||color=='#fff'){
		color='#333';
	}
	var marker = new BMap.Marker(pt, {
		icon : myIcon
	}); // 创建标注
	marker.setTitle(entName);
	marker.setZIndex(-1*h);
	var label=new BMap.Label(entName, {
		offset: new BMap.Size(10, 2) // 设置文本偏移量
	});
	
	label.setStyle({
		border:'none',
		//background:'transparent',
		background:color,
		cursor:'pointer',
		zIndex:-1*h-1,
		color:"#fff",
		padding:'0 2px 0 13px'
	});
	label.setTitle(entName);
	marker.setLabel(label);
	
	if(canClick){
		label.addEventListener("click", function(){
			window.location.href = pageUrl + '/views/entDetail.html?ent_id=' +id;
		});
		
		marker.addEventListener("click", function(){
			window.location.href = pageUrl + '/views/entDetail.html?ent_id=' +id;
		});
	}
	return marker;
}

MapDrawingHelpTool.getOverlaysObj=function(map){
	var reObj=[];
	var overlays=map.getOverlays();
	for(var i=0;i<overlays.length;i++){
		var overlay=overlays[i];
		if(overlay instanceof BMap.Polygon){
			if(!overlay.mydata||!overlay.mydata.type){
				continue;
			}
			var paths=overlay.getPath();
			var array=[];
			var obj={};
			for(var j=0;j<paths.length;j++){
				var path =paths[j];
				array.push({lng:path.lng,lat:path.lat});
			}
			obj.objType=mapOpts.polygon;
			obj.color=overlay.getFillColor();
			obj.array=array;
			reObj.push(obj);
			
		}else if(overlay instanceof BMap.Label){
			if(!overlay.mydata||!overlay.mydata.className){
				continue;
			}
			var obj={};
			obj.objType=mapOpts.label;
			obj.className=overlay.mydata.className;
			obj.content=overlay.getContent();
			var position=overlay.getPosition();
			obj.lng=position.lng;
			obj.lat=position.lat;
			reObj.push(obj);
		}else if(overlay instanceof BMap.Marker){
			
		}
	}
	return reObj;
}

MapDrawingHelpTool.getPolygon=function(polygonObj,mydata){
	var mapPoint=[];
	var array=polygonObj.array;
	if(array==undefined) return null;
	for(var j=0;j<array.length;j++){
		var point=array[j];
		mapPoint[j]=new BMap.Point(point.lng,point.lat);
	}
	var polygon = new BMap.Polygon(mapPoint);   //创建折线 
	polygon.mydata=mydata;
	polygon.setFillColor(polygonObj.color);
	polygon.setFillOpacity(commonStyleOptions.fillOpacity);
	polygon.setStrokeWeight(1);
	polygon.setStrokeColor(polygonObj.color);
	polygon.setStrokeOpacity(commonStyleOptions.strokeOpacity);
	return polygon; 
}

MapDrawingHelpTool.getPolygonWithoutFill=function(polygonObj,mydata){
	var mapPoint=[];
	var array=polygonObj.array;
	if(array==undefined) return null;
	for(var j=0;j<array.length;j++){
		var point=array[j];
		mapPoint[j]=new BMap.Point(point.lng,point.lat);
	}
	var polygon = new BMap.Polygon(mapPoint);   //创建折线 
	polygon.mydata=mydata;
	polygon.setFillColor(polygonObj.color);
	polygon.setFillOpacity(0.001);
	polygon.setStrokeWeight(2);
	polygon.setStrokeColor(polygonObj.color);
	polygon.setStrokeOpacity(commonStyleOptions.strokeOpacity);
	return polygon; 
}


MapDrawingHelpTool.createOverlayClick=function(me){
	 var ploygonClick = function(e){
		 //分割状态下不触发
		if(me._isIntecept) return;
		
		//处理旧选中对象
     	if(me._selectPolygon.toString()=="[object Polygon]"){
     		me._selectPolygon.disableEditing();
     	}else if(me._selectPolygon.toString()=="[object Label]"){
     		me._selectPolygon.setStyle(labelOpts.noborderStyle);
     	}
     	
     	//处理新选中对象
     	if(me._selectPolygon==this){
     		me._selectPolygon={};
     	}else{
     		me._selectPolygon=this;
     		if(this.toString()=="[object Polygon]"){
     			this.enableEditing();
     			if(me._opts.ploygonClick){
     				me._opts.ploygonClick(e);
     			}
     		}else if(this.toString()=="[object Label]"){
     			this.setStyle(labelOpts.borderStyle);
     			if(me._opts.labelClick){
     				me._opts.labelClick(e);
     			}

         	}
     	}
     	
     };
     return ploygonClick;
}




var commonStyleOptions = {
	strokeColor : "red", //边线颜色。
	fillColor : "red", //填充颜色。当参数为空时，圆形将没有填充效果。
	strokeWeight : 1, //边线的宽度，以像素为单位。
	strokeOpacity : 0.5, //边线透明度，取值范围0 - 1。
	fillOpacity : 0.6, //填充的透明度，取值范围0 - 1。
	strokeStyle : 'solid' //边线的样式，solid或dashed。
};

var NanJingBdary = [ "江苏南京","玄武区", "秦淮区", "鼓楼区", "建邺区", "栖霞区",
		"雨花台区", "浦口区", "江宁区", "六合区", "溧水区", "高淳区","江北新区"];

var divisionStyle = {
	strokeWeight : 3,
	strokeColor : "blue",
	strokeOpacity : 0.1,
	fillColor : "#00ffff",
	fillOpacity : 0.1
};

var divisionStyle2 = {
		strokeWeight : 3,
		strokeColor : "blue",
		strokeOpacity : 0.1,
		fillColor : "#fff",
		fillOpacity : 0.1
	};

var mapStyle = {
	styleJson :[
          {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": {
                              "lightness": 10,
                              "saturation": -100
                    }
          }
]
};

var mapStyle2 = {
		styleJson :[
		            {
	                    "featureType": "road",
	                    "elementType": "geometry",
	                    "stylers": {
	                              "color": "#ff0000ff"
	                    }
	          }
	]};


var opts = {
	width : 480, // 信息窗口宽度
	height : 540, // 信息窗口高度
	enableMessage : true//设置允许信息窗发送短息
};

var mapOpts = {
		defaultDrawingModes : [ "save", "add", "intercept","delete","text", "reset"],
		defaultDrawingTips : ["保存修改项","新增区域，单击增加节点，双击完成新建","分割选中区域，先选中2个分割点后分割，单击增加节点，双击完成分割","删除选中区域","新增文字","初始化地图"],
		defaultDrawingTexts : ["保存","新增","分割","删除","文字","刷新"],
		selectColor : "selectColor",
		polygon:1,
		label:2
	};


var labelOpts={
		noborderStyle:{"border":"0px"},
		borderStyle:{"border":"1px dashed"},
		defaultLabelStyle:{
			backgroundColor: "transparent",
			border:0,
			fontSize:"50px"
		},
		labelStyle_10 : [{
			className:"zoom_10",
			size : "50px"
		},{
			className:"zoom_11",
			size : "25px"
		},{
			className:"zoom_12",
			size : "12px"
		},{
			className:"zoom_13",
			size : "0"
		},{
			className:"zoom_14",
			size : "0"
		},{
			className:"zoom_15",
			size : "0"
		},{
			className:"zoom_16",
			size : "0"
		},{
			className:"zoom_17",
			size : "0"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_11 :  [{
			className:"zoom_10",
			size : "100px"
		},{
			className:"zoom_11",
			size : "50px"
		},{
			className:"zoom_12",
			size : "25px"
		},{
			className:"zoom_13",
			size : "12px"
		},{
			className:"zoom_14",
			size : "0"
		},{
			className:"zoom_15",
			size : "0"
		},{
			className:"zoom_16",
			size : "0"
		},{
			className:"zoom_17",
			size : "0"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_12 :  [{
			className:"zoom_10",
			size : "200px"
		},{
			className:"zoom_11",
			size : "100px"
		},{
			className:"zoom_12",
			size : "50px"
		},{
			className:"zoom_13",
			size : "20px"
		},{
			className:"zoom_14",
			size : "10px"
		},{
			className:"zoom_15",
			size : "0"
		},{
			className:"zoom_16",
			size : "0"
		},{
			className:"zoom_17",
			size : "0"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_13 :  [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "200px"
		},{
			className:"zoom_12",
			size : "100px"
		},{
			className:"zoom_13",
			size : "50px"
		},{
			className:"zoom_14",
			size : "25px"
		},{
			className:"zoom_15",
			size : "12px"
		},{
			className:"zoom_16",
			size : "0"
		},{
			className:"zoom_17",
			size : "0"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_14 :  [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "200px"
		},{
			className:"zoom_13",
			size : "100px"
		},{
			className:"zoom_14",
			size : "50px"
		},{
			className:"zoom_15",
			size : "25px"
		},{
			className:"zoom_16",
			size : "12px"
		},{
			className:"zoom_17",
			size : "0"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_15 :  [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "0px"
		},{
			className:"zoom_13",
			size : "200px"
		},{
			className:"zoom_14",
			size : "100px"
		},{
			className:"zoom_15",
			size : "50px"
		},{
			className:"zoom_16",
			size : "25px"
		},{
			className:"zoom_17",
			size : "12px"
		},{
			className:"zoom_18",
			size : "0"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_16 : [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "0px"
		},{
			className:"zoom_13",
			size : "0"
		},{
			className:"zoom_14",
			size : "200px"
		},{
			className:"zoom_15",
			size : "100px"
		},{
			className:"zoom_16",
			size : "50px"
		},{
			className:"zoom_17",
			size : "25px"
		},{
			className:"zoom_18",
			size : "12px"
		},{
			className:"zoom_19",
			size : "0"
		}],
		labelStyle_17 : [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "0px"
		},{
			className:"zoom_13",
			size : "0"
		},{
			className:"zoom_14",
			size : "0"
		},{
			className:"zoom_15",
			size : "200px"
		},{
			className:"zoom_16",
			size : "100px"
		},{
			className:"zoom_17",
			size : "50px"
		},{
			className:"zoom_18",
			size : "25px"
		},{
			className:"zoom_19",
			size : "12px"
		}],
		labelStyle_18 :  [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "0px"
		},{
			className:"zoom_13",
			size : "0"
		},{
			className:"zoom_14",
			size : "0"
		},{
			className:"zoom_15",
			size : "0"
		},{
			className:"zoom_16",
			size : "200px"
		},{
			className:"zoom_17",
			size : "100px"
		},{
			className:"zoom_18",
			size : "50px"
		},{
			className:"zoom_19",
			size : "25px"
		}],
		labelStyle_19 :  [{
			className:"zoom_10",
			size : "0px"
		},{
			className:"zoom_11",
			size : "0px"
		},{
			className:"zoom_12",
			size : "0px"
		},{
			className:"zoom_13",
			size : "0"
		},{
			className:"zoom_14",
			size : "0"
		},{
			className:"zoom_15",
			size : "0"
		},{
			className:"zoom_16",
			size : "0"
		},{
			className:"zoom_17",
			size : "200px"
		},{
			className:"zoom_18",
			size : "100px"
		},{
			className:"zoom_19",
			size : "50px"
		}]
};



