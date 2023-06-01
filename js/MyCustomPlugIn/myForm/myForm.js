/**
 * 通用的处理表单的一些方法 ( 基于JQuery )( 基于LayUI )
 * author:HuangDong
 */

/**
 * 禁用表单输入框
 * @param 输入控件id
 * @return 
 */
function setInputDisabled(id){
	$("#" + id).attr("readonly" , "readonly");
	$("#" + id).css("background-color" , "#F0F0F0");
}
/**
 * 启用表单输入框
 * @param 输入控件id
 * @return 
 */
function setInputEnabled(id){
	$("#" + id).removeAttr("readonly");
	$("#" + id).css("background-color" , "");
}


/**
 * 渲染表单中的 .my-date 为日期框 ( 基于LayUI )
 * @param 输入控件id
 * @return 
 */
$(document).ready(function(){
	if($(".my-date").length > 0){
		$(".my-date").each(function(){
			var id= $(this).attr("id");
		    laydate.render({
		    	 elem: '#'+id
		    });
		});
	}
});


/**
 * 渲染表单中的 .my-select 为下拉框
 * @param 输入控件id
 * @return 
 */
$(document).ready(function(){
	if($(".my-select").length > 0){
		$(".my-select").each(function(){
			var id= $(this).attr("id");//id
		    var value = $(this).attr("value");//value
		    var valueField = $(this).attr("valueField");//valueField
		    var textField = $(this).attr("textField");//textField
		    var url = $(this).attr("url");//url
		    var data = $(this).attr("data");//data
		    
		    var dataJson = [];
		    if(url != null && url != ""){
		    	$.ajax({
	                url: url,
	                type : 'POST',	               
	                data: "",
	                async: false,
	                success: function (data) {
	                	dataJson = eval('(' + data + ')');
	                }
	            });
		    }else if(data != null && data != ""){
		    	dataJson = eval('(' + data + ')');
		    }
		    
		    var optionHtml = '<option value="">请选择</option>';
            for(var i = 0 ; i < dataJson.length ; i++){
            	var val = dataJson[i][valueField];
            	var text = dataJson[i][textField];            	
            	if(value == val){
            		optionHtml = optionHtml + '<option value="' + val + '" selected>' + text + '</option>';
            	}else{
            		optionHtml = optionHtml + '<option value="' + val + '">' + text + '</option>';
            	}                    	
            }
            $("#"+id).children().remove();
			$("#"+id).append(optionHtml);
			
		});
	}
});
