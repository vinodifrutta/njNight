 //测试环境
var staticurl = 'https://site.sumexsoft.com';  
// var staticurl = 'https://syxx.njsmzx.gov.cn';
//var staticurl = 'https://xwx.sumexsoft.com';
// var staticurl = 'https://hd.sumexsoft.com';

// var pageUrl = 'http://180.101.236.100:28081/logoNJ';  ///
//var pageUrl = 'http://127.0.0.1:5500';



// var staticurl = 'https://xwx.sumexsoft.com';
var pageUrl = 'http://127.0.0.1:5501';
// var pageUrl = 'http://124.70.10.35:30081';

// 访问记录
function saveAsk (name, url) {
  //获取url
  if (!url) {
    url = window.parent.location.href;
    url = url.replace(pageUrl, "");
    //if(url.indexOf("&") > -1){
    //	url = url.substring(0, url.indexOf("&"));
    //}
    console.log(url);
  }

  $.ajax({
    url: staticurl + '/bBusWebVisit',
    type: 'POST',
    // async: true,
    data: { "url": url, 'page': name },
    success: function (res) {
      var data = JSON.parse(res);
      console.log(data);
    },
    error: function (err) {
      console.log('err', err);
    }
  });
}


function getUrlParameter (name) {
  name = name.replace(/[]/, "\[").replace(/[]/, "\[").replace(/[]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.parent.location.href);
  if (results == null) return ""; else {
    return decodeURI(results[1]);
  }
};


