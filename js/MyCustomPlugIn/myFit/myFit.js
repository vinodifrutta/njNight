/**
 * DIV 高度自适应容器(.my-fit)事件 ( 基于JQuery )
 * author:HuangDong
 */

/** DIV 高度自适应容器(.my-fit)事件
  * 从Miniui的mini-fit有感而发( 它的高度为：父元素高度 - 其他同级元素高度)，
  * 故而同一个父元素下只能有一个 .my-fit
======================================================================================================================= **/
$(document).ready(function(){
	if($(".my-fit").length > 0){
		setMyFit();
	}
});
$(window).resize(function() {
	if($(".my-fit").length > 0){
		setMyFit();
	}
})
function setMyFit(){
	$(".my-fit").each(function(){
		var fatherHeight = $(this).parent().height();
		var margin = parseInt($(this).css("margin-top")) + parseInt($(this).css("margin-bottom"));//本身margin
		var siblingsHeight = 0;   		
		$(this).siblings().each(function(){
			var nodeName = $(this).prop("nodeName").toLowerCase();
			if(nodeName!="style" && nodeName!="script" && nodeName!="link"){
				siblingsHeight = parseInt(siblingsHeight) + parseInt($(this).height()) + parseInt($(this).css("margin-top")) + parseInt($(this).css("margin-bottom"));				
			}
		});    				
		var thisHeight = parseInt(fatherHeight) - parseInt(siblingsHeight) - parseInt(margin);  
		$(this).css("height" , thisHeight + "px");
	});
}
