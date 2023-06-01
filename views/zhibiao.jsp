<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false"%>
<%@ include file="/common/jstlres.jsp"%>
<%@ include file="/common/nuires.jsp"%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>首页</title>
<%-- <script src="<%=request.getContextPath()%>/resource/echarts/echarts.min.js" type="text/javascript"></script>  --%>
<script src="<%=request.getContextPath()%>/resource/echarts/radarmap.min.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/resource/css/main1.css">
	<script type="text/javascript" src="<%=request.getContextPath()%>/resource/js/echarts.js"></script>
	<script src="<%=request.getContextPath()%>/resource/echarts/linemap.js" type="text/javascript"></script>
<%-- 	<script type="text/javascript" src="<%=request.getContextPath()%>/resource/echarts/jquery.min.js"></script>
 --%>	<script type="text/javascript" src="<%=request.getContextPath()%>/resource/echarts/echarts.min.js"></script>
 		<script src="<%= request.getContextPath() %>/resource/js/jquery.min.js"></script>
 
<link rel="stylesheet" type="text/css" href="<%= request.getContextPath() %>/resource/css/index.css">
 <style type="text/css">
/*  #mini-buttonedit-input{border-style:none none solid none;}
 */
 	.main_box_ywmk{
			background:#ffffff;
			border-radius:5px;
			height:40%;
			width:99.5%;
			margin-top:5px;
			margin-left:10px;
			overflow:hidden;
	    	/* white-space:nowrap;
	    	display:inline-block; */
	}
	.main_box_tjzb{
			background:#ffffff;
			border-radius:5px;
			height:55%;
			width:50%;
			float:left;
			margin-top:10px;
			margin-left:10px;
	}
	.main_box_pjzb{
			background:#ffffff;
			border-radius:5px;
			height:55%;
			width:48.5%;
			float:left;
			margin-top:10px;
			margin-left:10px;
	}
	.main_title{
		    font-size: 16px;
		    padding-left: 6px;
		    padding-top: 16px;
	}
	.content_box{
		  	margin-top:10px;
		 	margin-left:10px;
			float:left;
			overflow:hidden;
	}
	.main_chart{
		  	float:left;
		  	width:19%;
			height:230px;
			margin-left:10px;
			
	}
	.yincang{
   		display:none!important;
   	
   	}
   	.left-div{
   		display:inline-block;
   	
   	}
   	.right-div{
   		display:inline-block;
   	
   	}
   	.text-chaochu-gundong{
	    		overflow:hidden;
	    		white-space:nowrap;
	    		border:1px solid;
	    		height:50px;
	    		width:600px;
	    		display:inline-block;
	    	}
 </style> 
	
</head>

<body>
	<div class="main_box">
	<div class="main_box_ywmk">
<!-- 		<div class="content_box">
 -->		<div class="main_title">
       		<span >
        		<b>业务模块</b>
       		</span>
       		</div>

       		<div class="main_chart">
        		       	<div id="mainMap1" style="height:220px;"></div>
      		</div>
       		<div class="main_chart">
        		        <div id="mainMap2" style="height:220px;"></div>
       		</div>
       		<div class="main_chart">
       		        	<div id="mainMap3" style="height:220px;"></div>
       		</div>
       		<div class="main_chart">
       		        	<div id="mainMap4" style="height:220px;"></div>
       		</div>
       		<div class="main_chart">
       		        	<div id="mainMap5" style="height:220px;"></div>
       		</div>
       		
<!--        </div>
 --> 	</div> 
    
    <div class="main_box_tjzb">
 		<div class="main_title ">
        	<span >
        		<b>统计类指标</b>
        	</span>
        </div>
        <div class="nui-fit" >			    
		   <div id="datagrid1" class="nui-datagrid"  url="<%=root%>/negativeintegra/getList"  onrowdblclick="" onselectionchanged="onSelectionChanged"
			     	style="width: 100%;height: 100%;" multiSelect="false" allowUnselect="false" autoEscape="false" > 
				<div property="columns">
					<div headerAlign="center" width="50" type="indexcolumn" visible="true">序号</div>   
					<div field="id" visible="false"><fmt:message key="ID"/></div>
			        <div field="lsh" visible="false"  headerAlign="center"   width="150" align="center">流水号</div>
			        <div field="sxrq"   allowSort="true" width="100" headerAlign="center" align="center" dateformat="yyyyMMdd hh:mm:ss">事项日期</div>
			        <div field="czrorg"  allowSort="true" headerAlign="center" width="100" align="left" >登记机构</div>
				</div>
			</div>  
		</div>
   
    </div> 
     <div class="main_box_pjzb">
		<div class="main_title">
        	<span class="">
        		<b>评价类指标</b>
        	</span>
        </div>	
        <div class="nui-fit" >			    
		   <div id="datagrid2" class="nui-datagrid"  url="<%=root%>/warningcount/getList"  onrowdblclick="" onselectionchanged="onSelectionChanged"
			     	style="width: 100%;height: 100%;" multiSelect="false" allowUnselect="false" autoEscape="false" > 
				<div property="columns">
					<div headerAlign="center" width="50" type="indexcolumn" visible="true">序号</div>   
					<div field="id" visible="false"><fmt:message key="ID"/></div>
			        <div field="orgname" visible="false"  headerAlign="center"   width="150" align="center">机构</div>
			        <div field="warning_name"   allowSort="true" width="100" headerAlign="center" align="center">预警名称</div>
			        <div field="busi_module"  allowSort="true" headerAlign="center" width="100" align="left" >业务模块</div>
				</div>
			</div>  
		</div>    
    </div> 
    </div>
</body>
</html>
<script type="text/javascript">
	$G.parse();
	var root = "<%=root%>";
	var mychart1;
	var mychart2;
	var mychart3;
	var mychart4;
	var mychart5;
	var grid1 =$G.get("datagrid1");
	var grid2 =$G.get("datagrid2");
	grid1.load();
	grid2.load();
	var i =0;
	$(document).on("click",".right-div",function(){
		var witdh_div = 0 ;
		$.each($(".main_box_ywmk").children("div"),function(idx,item){
			if(!$(item).hasClass("yincang")){
				witdh_div +=$(item).width();
			}
		});
		if(witdh_div < $(".main_box_ywmk").width()){
			return false;
		}
		
		$(this).prev("div").children("div").eq(i).addClass("yincang");
		i+=1;
	});
	$(document).on("click",".left-div",function(){
		
		if(i>0){
			i=i-1;
		}
		$(this).next("div").children("div").eq(i).removeClass("yincang");

	});
	
	function onSelectionChanged() {
		
	}
	mychart1 = echarts.init(document.getElementById('mainMap1'));
	mychart2 = echarts.init(document.getElementById('mainMap2'));
	mychart3 = echarts.init(document.getElementById('mainMap3'));
	mychart4 = echarts.init(document.getElementById('mainMap4'));
	mychart5 = echarts.init(document.getElementById('mainMap5'));
	var option;
	var str = "指标数量:70"+"\n"+"最新数据日期:20211116";
	option = {
		grid:{
			top:0,
			bottom:0
		},
		series:[
			{
				type:'gauge',
				max:240,
				splitNumber:12,
				axisLine:{
					lineStyle:{
						width:10,
						color:[
							[1,'#fd666d']
						]
					}
				},
				pointer:{
					itemStyle:{
						color:'#000'
					},
					width:6,
					length:'65%'
				},
				axisTick:{
					distance:-20,
					length:5,
					lineStyle:{
						color:'#fff',
						width:2
					}
				},
				splitLine:{
					distance:-10,
					length:10,
					lineStyle:{
						color:'#fff',
						width:2
					}
				},
				axisLabel:{
					color:'#000',
					distance:4,
					fontSize:8
				},
				detail:{
					valueAnimation:true,
					offsetCenter:[0,'70%'],
					formatter:str,
					color:'#000000',
					fontSize:8
				},
				data:[
					{
						value:70,name:'智能柜台'
					}
				]
			}
		]
			
	};
	/* setInterval(function (){
		mychart1.setOption({
			series:[
				{
					data:[
						{
							value:+(Math.random()* 100).toFixed(2)
						}
					]
				}
			]
		})
	},2000); */
	option && mychart1.setOption(option);
	option && mychart2.setOption(option);
	option.series[0].data=[{value:10,name:'现金出纳'}]
	option && mychart3.setOption(option); 
	option && mychart4.setOption(option);
	option && mychart5.setOption(option);
	
</script>
