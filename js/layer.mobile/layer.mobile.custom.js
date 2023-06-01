/**
 * 基于layer_mobile 的弹窗方法
 * create by HuangDong
 */
var layerUtils = {
    alertMsg: function(content) {
        var index = layer.open({
            content: content,
            btn: '我知道了'
        });
        return index;
    },
    tips: function(content) {
        var index = layer.open({
            content: content,
            skin: 'msg',
            time: 2
        });
        return index;
    },
    loading: function(content) {
        var index = layer.open({
            type: 2,
            content: content,
            shade: 'background-color: rgba(0,0,0,0.3)'
        });
        return index;
    },
    closeAll: function() {
        layer.closeAll();
    },

    //自定义底部对话框
    confirm: function(msg , confirmList) {
        var height = 60 + 50 * confirmList.length + 50 + 10;
        var html = "<div class='layer-mobile-custom-confirm-inner' style='height: " + height + ";'>";
                html = html + "<div class='layer-mobile-custom-confirm-msg'>" + msg + "</div>"
                for(var i = 0 ; i < confirmList.length ; i++){
                    var borderRadius = (i == (confirmList.length-1))?"borderRadius":"";
                    html = html + "<div class='layer-mobile-custom-confirm-every "+ borderRadius +"'>" + confirmList[i] + "</div>"
                }
                html = html + "<div class='layer-mobile-custom-confirm-every cancel'>" + "取消" + "</div>"
            html = html + "</div>"
        var thisConfirm = layer.open({ type: 1,  content: html, anim: 'up',  className: 'layer-mobile-custom-confirm' , style: 'height: '+ height + 'px; ' });
        this.method =function(callback){
            if(typeof callback==="function"){
                $(".layer-mobile-custom-confirm-every").click(function(){
                    var text = $(this).text();
                    if(text == "取消"){
                        layer.close(thisConfirm);
                    }else{
                       callback(text);
                       layer.close(thisConfirm);
                    }
                })
            }
        }
        /*
        new layerUtils.confirm(["保存","删除"]).method(function(name){
            alert(name);
        });
        */
    },

    // 自定义弹出页面
    openWindow: function(url , width , height , showToolBar) {
        var window_id = layerUtils.getUUID();
        var top = "calc(calc(100% - " + height + "px)/2)";
        var left = "calc(calc(100% - " + width + "px)/2)";
        var idShowToolabr= "";
        var frameHeight = height - 30;
        if(showToolBar == false){
            idShowToolabr = "hide";
            frameHeight = height;
        }
        if(url.indexOf("?")==-1 && url.indexOf("&")==-1){
            url = url + "?window_id=" + window_id;
        }else{
            url = url + "&window_id=" + window_id;
        }
        var windowHtml = ""
            +'<div class="customer-open-window shadow" id="' + window_id + '" style="top: ' + top + '; left: ' + left + '; width: ' + width + 'px; height: ' + height + 'px;">'
            +    '<div class="customer-open-window-toolbar ' + idShowToolabr + '"><div class="return" onclick="layerUtils.closeThisWindowById(\''+ window_id +'\')">×</div></div>'
            +    '<iframe src="' + url + '"  id="iframepage" name="iframepage" frameBorder=0 scrolling=no width="100%" height="' + frameHeight + 'px" style="border-radius: 10px;"></iframe>'
            + '</div>';
        $("body").append(windowHtml);

        return window_id;

    },
    closeThisWindowById: function(window_id) {
        $("#" + window_id).remove();
    },
    closeThisWindow: function() {
        var window_id = layerUtils.getQueryVariable("window_id" , null);
        window.parent.layerUtils.closeThisWindowById(window_id);
    },

    //生成32位随机ID
    getUUID: function() {
        var A = [],
            _ = "0123456789ABCDEF".split("");
        for (var $ = 0; $ < 36; $++) A[$] = Math.floor(Math.random() * 16);
        A[14] = 4;
        A[19] = (A[19] & 3) | 8;
        for ($ = 0; $ < 36; $++) A[$] = _[A[$]];
        A[8] = A[13] = A[18] = A[23] = "-";
        var uuid = A.join("");
        uuid = uuid.replace(/-/g,'');
        return uuid
    },

    /**
     *  根据参数Key获取URL中的参数Value
     * @param key 参数key
     * @returns {*}
     */
    getQueryVariable: function(key , url) {
        if(url == null || url == "" || url == undefined || url == "undefined" || typeof(url)==undefined){
            query = window.location.search.substring(1);
        }
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == key){return pair[1];}
        }
        return(false);
    }

}
