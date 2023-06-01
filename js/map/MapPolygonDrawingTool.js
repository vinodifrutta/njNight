/**
 * @fileoverview 百度地图的鼠标绘制工具，对外开放。
 * 允许用户在地图上点击完成鼠标绘制的功能。
 * 使用者可以自定义所绘制结果的相关样式，例如线宽、颜色、测线段距离、面积等等。
 * 基于Baidu Map API 1.4。
 *
 * @author Baidu Map Api Group 
 * @version 1.4
 */

/** 
 * @namespace BMap的所有library类均放在BMapPol命名空间下
 */
var BMapPol = window.BMapPol = BMapPol || {};

(function() {

	/**
	 * 声明baidu包
	 */
	var baidu = baidu || {
		guid : "$BAIDU$"
	};
	(function() {
		// 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
		window[baidu.guid] = {};

		/**
		 * 将源对象的所有属性拷贝到目标对象中
		 * @name baidu.extend
		 * @function
		 * @grammar baidu.extend(target, source)
		 * @param {Object} target 目标对象
		 * @param {Object} source 源对象
		 * @returns {Object} 目标对象
		 */
		baidu.extend = function(target, source) {
			for ( var p in source) {
				if (source.hasOwnProperty(p)) {
					target[p] = source[p];
				}
			}
			return target;
		};

		/**
		 * @ignore
		 * @namespace
		 * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
		 * @property guid 对象的唯一标识
		 */
		baidu.lang = baidu.lang || {};

		/**
		 * 返回一个当前页面的唯一标识字符串。
		 * @function
		 * @grammar baidu.lang.guid()
		 * @returns {String} 当前页面的唯一标识字符串
		 */
		baidu.lang.guid = function() {
			return "TANGRAM__" + (window[baidu.guid]._counter++).toString(36);
		};

		window[baidu.guid]._counter = window[baidu.guid]._counter || 1;

		/**
		 * 所有类的实例的容器
		 * key为每个实例的guid
		 */
		window[baidu.guid]._instances = window[baidu.guid]._instances || {};

		/**
		 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
		 * @function
		 * @name baidu.lang.Class
		 * @grammar baidu.lang.Class(guid)
		 * @param {string} guid 对象的唯一标识
		 * @meta standard
		 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
		 * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
		 * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
		 */
		baidu.lang.Class = function(guid) {
			this.guid = guid || baidu.lang.guid();
			window[baidu.guid]._instances[this.guid] = this;
		};

		window[baidu.guid]._instances = window[baidu.guid]._instances || {};

		/**
		 * 判断目标参数是否string类型或String对象
		 * @name baidu.lang.isString
		 * @function
		 * @grammar baidu.lang.isString(source)
		 * @param {Any} source 目标参数
		 * @shortcut isString
		 * @meta standard
		 *             
		 * @returns {boolean} 类型判断结果
		 */
		baidu.lang.isString = function(source) {
			return '[object String]' == Object.prototype.toString.call(source);
		};

		/**
		 * 判断目标参数是否为function或Function实例
		 * @name baidu.lang.isFunction
		 * @function
		 * @grammar baidu.lang.isFunction(source)
		 * @param {Any} source 目标参数
		 * @returns {boolean} 类型判断结果
		 */
		baidu.lang.isFunction = function(source) {
			return '[object Function]' == Object.prototype.toString
					.call(source);
		};

		/**
		 * 重载了默认的toString方法，使得返回信息更加准确一些。
		 * @return {string} 对象的String表示形式
		 */
		baidu.lang.Class.prototype.toString = function() {
			return "[object " + (this._className || "Object") + "]";
		};

		/**
		 * 释放对象所持有的资源，主要是自定义事件。
		 * @name dispose
		 * @grammar obj.dispose()
		 */
		baidu.lang.Class.prototype.dispose = function() {
			delete window[baidu.guid]._instances[this.guid];
			for ( var property in this) {
				if (!baidu.lang.isFunction(this[property])) {
					delete this[property];
				}
			}
			this.disposed = true;
		};

		/**
		 * 自定义的事件对象。
		 * @function
		 * @name baidu.lang.Event
		 * @grammar baidu.lang.Event(type[, target])
		 * @param {string} type  事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
		 * @param {Object} [target]触发事件的对象
		 * @meta standard
		 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
		 * @see baidu.lang.Class
		 */
		baidu.lang.Event = function(type, target) {
			this.type = type;
			this.returnValue = true;
			this.target = target || null;
			this.currentTarget = null;
		};

		/**
		 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
		 * @grammar obj.addEventListener(type, handler[, key])
		 * @param   {string}   type         自定义事件的名称
		 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
		 * @param   {string}   [key]        为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
		 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
		 */
		baidu.lang.Class.prototype.addEventListener = function(type, handler,
				key) {
			if (!baidu.lang.isFunction(handler)) {
				return;
			}
			!this.__listeners && (this.__listeners = {});
			var t = this.__listeners, id;
			if (typeof key == "string" && key) {
				if (/[^\w\-]/.test(key)) {
					throw ("nonstandard key:" + key);
				} else {
					handler.hashCode = key;
					id = key;
				}
			}
			type.indexOf("on") != 0 && (type = "on" + type);
			typeof t[type] != "object" && (t[type] = {});
			id = id || baidu.lang.guid();
			handler.hashCode = id;
			t[type][id] = handler;
		};

		/**
		 * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
		 * @grammar obj.removeEventListener(type, handler)
		 * @param {string}   type     事件类型
		 * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
		 * @remark  如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
		 */
		baidu.lang.Class.prototype.removeEventListener = function(type, handler) {
			if (baidu.lang.isFunction(handler)) {
				handler = handler.hashCode;
			} else if (!baidu.lang.isString(handler)) {
				return;
			}
			!this.__listeners && (this.__listeners = {});
			type.indexOf("on") != 0 && (type = "on" + type);
			var t = this.__listeners;
			if (!t[type]) {
				return;
			}
			t[type][handler] && delete t[type][handler];
		};

		/**
		 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
		 * @grammar obj.dispatchEvent(event, options)
		 * @param {baidu.lang.Event|String} event   Event对象，或事件名称(1.1.1起支持)
		 * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
		 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
		 * 例如：<br>
		 * myobj.onMyEvent = function(){}<br>
		 * myobj.addEventListener("onMyEvent", function(){});
		 */
		baidu.lang.Class.prototype.dispatchEvent = function(event, options) {
			if (baidu.lang.isString(event)) {
				event = new baidu.lang.Event(event);
			}
			!this.__listeners && (this.__listeners = {});
			options = options || {};
			for ( var i in options) {
				event[i] = options[i];
			}
			var i, t = this.__listeners, p = event.type;
			event.target = event.target || this;
			event.currentTarget = this;
			p.indexOf("on") != 0 && (p = "on" + p);
			baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
			if (typeof t[p] == "object") {
				for (i in t[p]) {
					t[p][i].apply(this, arguments);
				}
			}
			return event.returnValue;
		};

		/**
		 * 为类型构造器建立继承关系
		 * @name baidu.lang.inherits
		 * @function
		 * @grammar baidu.lang.inherits(subClass, superClass[, className])
		 * @param {Function} subClass 子类构造器
		 * @param {Function} superClass 父类构造器
		 * @param {string} className 类名标识
		 * @remark 使subClass继承superClass的prototype，
		 * 因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
		 * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
		 * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
		 * @shortcut inherits
		 * @meta standard
		 * @see baidu.lang.Class
		 */
		baidu.lang.inherits = function(subClass, superClass, className) {
			var key, proto, selfProps = subClass.prototype, clazz = new Function();
			clazz.prototype = superClass.prototype;
			proto = subClass.prototype = new clazz();
			for (key in selfProps) {
				proto[key] = selfProps[key];
			}
			subClass.prototype.constructor = subClass;
			subClass.superClass = superClass.prototype;

			if ("string" == typeof className) {
				proto._className = className;
			}
		};

		/**
		 * @ignore
		 * @namespace baidu.dom 操作dom的方法。
		 */
		baidu.dom = baidu.dom || {};

		/**
		 * 从文档中获取指定的DOM元素
		 * 
		 * @param {string|HTMLElement} id 元素的id或DOM元素
		 * @meta standard
		 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
		 */
		baidu._g = baidu.dom._g = function(id) {
			if (baidu.lang.isString(id)) {
				return document.getElementById(id);
			}
			return id;
		};

		/**
		 * 从文档中获取指定的DOM元素
		 * @name baidu.dom.g
		 * @function
		 * @grammar baidu.dom.g(id)
		 * @param {string|HTMLElement} id 元素的id或DOM元素
		 * @meta standard
		 *             
		 * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
		 */
		baidu.g = baidu.dom.g = function(id) {
			if ('string' == typeof id || id instanceof String) {
				return document.getElementById(id);
			} else if (id && id.nodeName
					&& (id.nodeType == 1 || id.nodeType == 9)) {
				return id;
			}
			return null;
		};

		/**
		 * 在目标元素的指定位置插入HTML代码
		 * @name baidu.dom.insertHTML
		 * @function
		 * @grammar baidu.dom.insertHTML(element, position, html)
		 * @param {HTMLElement|string} element 目标元素或目标元素的id
		 * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
		 * @param {string} html 要插入的html
		 * @remark
		 * 
		 * 对于position参数，大小写不敏感<br>
		 * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
		 * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
		 * 
		 * @shortcut insertHTML
		 * @meta standard
		 *             
		 * @returns {HTMLElement} 目标元素
		 */
		baidu.insertHTML = baidu.dom.insertHTML = function(element, position,
				html) {
			element = baidu.dom.g(element);
			var range, begin;

			if (element.insertAdjacentHTML) {
				element.insertAdjacentHTML(position, html);
			} else {
				// 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
				// 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
				range = element.ownerDocument.createRange();
				// FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
				// 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
				position = position.toUpperCase();
				if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
					range.selectNodeContents(element);
					range.collapse(position == 'AFTERBEGIN');
				} else {
					begin = position == 'BEFOREBEGIN';
					range[begin ? 'setStartBefore' : 'setEndAfter'](element);
					range.collapse(begin);
				}
				range.insertNode(range.createContextualFragment(html));
			}
			return element;
		};

		/**
		 * 为目标元素添加className
		 * @name baidu.dom.addClass
		 * @function
		 * @grammar baidu.dom.addClass(element, className)
		 * @param {HTMLElement|string} element 目标元素或目标元素的id
		 * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
		 * @remark
		 * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
		 * @shortcut addClass
		 * @meta standard
		 *              
		 * @returns {HTMLElement} 目标元素
		 */
		baidu.ac = baidu.dom.addClass = function(element, className) {
			element = baidu.dom.g(element);
			var classArray = className.split(/\s+/), result = element.className, classMatch = " "
					+ result + " ", i = 0, l = classArray.length;

			for (; i < l; i++) {
				if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
					result += (result ? ' ' : '') + classArray[i];
				}
			}

			element.className = result;
			return element;
		};

		/**
		 * @ignore
		 * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
		 * @property target     事件的触发元素
		 * @property pageX      鼠标事件的鼠标x坐标
		 * @property pageY      鼠标事件的鼠标y坐标
		 * @property keyCode    键盘事件的键值
		 */
		baidu.event = baidu.event || {};

		/**
		 * 事件监听器的存储表
		 * @private
		 * @meta standard
		 */
		baidu.event._listeners = baidu.event._listeners || [];

		/**
		 * 为目标元素添加事件监听器
		 * @name baidu.event.on
		 * @function
		 * @grammar baidu.event.on(element, type, listener)
		 * @param {HTMLElement|string|window} element 目标元素或目标元素id
		 * @param {string} type 事件类型
		 * @param {Function} listener 需要添加的监听器
		 * @remark
		 *  1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
		 *  2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败            
		 * @shortcut on
		 * @meta standard
		 * @see baidu.event.un
		 *             
		 * @returns {HTMLElement|window} 目标元素
		 */
		baidu.on = baidu.event.on = function(element, type, listener) {
			type = type.replace(/^on/i, '');
			element = baidu._g(element);
			var realListener = function(ev) {
				// 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
				// 2. element是为了修正this
				listener.call(element, ev);
			}, lis = baidu.event._listeners, filter = baidu.event._eventFilter, afterFilter, realType = type;
			type = type.toLowerCase();
			// filter过滤
			if (filter && filter[type]) {
				afterFilter = filter[type](element, type, realListener);
				realType = afterFilter.type;
				realListener = afterFilter.listener;
			}
			// 事件监听器挂载
			if (element.addEventListener) {
				element.addEventListener(realType, realListener, false);
			} else if (element.attachEvent) {
				element.attachEvent('on' + realType, realListener);
			}

			// 将监听器存储到数组中
			lis[lis.length] = [ element, type, listener, realListener, realType ];
			return element;
		};

		/**
		 * 为目标元素移除事件监听器
		 * @name baidu.event.un
		 * @function
		 * @grammar baidu.event.un(element, type, listener)
		 * @param {HTMLElement|string|window} element 目标元素或目标元素id
		 * @param {string} type 事件类型
		 * @param {Function} listener 需要移除的监听器
		 * @shortcut un
		 * @meta standard
		 *             
		 * @returns {HTMLElement|window} 目标元素
		 */
		baidu.un = baidu.event.un = function(element, type, listener) {
			element = baidu._g(element);
			type = type.replace(/^on/i, '').toLowerCase();

			var lis = baidu.event._listeners, len = lis.length, isRemoveAll = !listener, item, realType, realListener;

			//如果将listener的结构改成json
			//可以节省掉这个循环，优化性能
			//但是由于un的使用频率并不高，同时在listener不多的时候
			//遍历数组的性能消耗不会对代码产生影响
			//暂不考虑此优化
			while (len--) {
				item = lis[len];

				// listener存在时，移除element的所有以listener监听的type类型事件
				// listener不存在时，移除element的所有type类型事件
				if (item[1] === type && item[0] === element
						&& (isRemoveAll || item[2] === listener)) {
					realType = item[4];
					realListener = item[3];
					if (element.removeEventListener) {
						element.removeEventListener(realType, realListener,
								false);
					} else if (element.detachEvent) {
						element.detachEvent('on' + realType, realListener);
					}
					lis.splice(len, 1);
				}
			}
			return element;
		};

		/**
		 * 获取event事件,解决不同浏览器兼容问题
		 * @param {Event}
		 * @return {Event}
		 */
		baidu.getEvent = baidu.event.getEvent = function(event) {
			return window.event || event;
		}

		/**
		 * 获取event.target,解决不同浏览器兼容问题
		 * @param {Event}
		 * @return {Target}
		 */
		baidu.getTarget = baidu.event.getTarget = function(event) {
			var event = baidu.getEvent(event);
			return event.target || event.srcElement;
		}

		/**
		 * 阻止事件的默认行为
		 * @name baidu.event.preventDefault
		 * @function
		 * @grammar baidu.event.preventDefault(event)
		 * @param {Event} event 事件对象
		 * @meta standard
		 */
		baidu.preventDefault = baidu.event.preventDefault = function(event) {
			var event = baidu.getEvent(event);
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		};

		/**
		 * 停止事件冒泡传播
		 * @param {Event}
		 */
		baidu.stopBubble = baidu.event.stopBubble = function(event) {
			event = baidu.getEvent(event);
			event.stopPropagation ? event.stopPropagation()
					: event.cancelBubble = true;
		}

		baidu.browser = baidu.browser || {};

		if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
			//IE 8下，以documentMode为准
			//在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
			/**
			 * 判断是否为ie浏览器
			 * @property ie ie版本号
			 * @grammar baidu.browser.ie
			 * @meta standard
			 * @shortcut ie
			 * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon 
			 */
			baidu.browser.ie = baidu.ie = document.documentMode
					|| +RegExp['\x241'];
		}

	})();

	/**
	 * 定义常量, 绘制的模式
	 * @final {Number} DrawingType
	 */
	


	var MapPolygonDrawingTool = BMapPol.MapPolygonDrawingTool = function(map, opts) {
		if (!map) {
			return;
		}
		opts = opts || {};
		this._initialize(map, opts);
	}

	// 通过baidu.lang下的inherits方法，让MapPolygonDrawingTool继承baidu.lang.Class
    baidu.lang.inherits(MapPolygonDrawingTool, baidu.lang.Class, "MapPolygonDrawingTool");
    
    
    MapPolygonDrawingTool.prototype._initialize = function(map, opts) {
        this._map = map;
        this._opts = opts||{};
        this.overlay=null;
    }
    
    MapPolygonDrawingTool.prototype.add=function(){
    	
    	if (this._isOpen != true){
    		this.clear();
    		this.open();
    		return this._bindAdd();
    	}
    }
    
    
    /**
     * 开启地图的绘制模式
     *
     * @example <b>参考示例：</b><br />
     */
    MapPolygonDrawingTool.prototype.open = function() {
        // 判断绘制状态是否已经开启
        if (this._isOpen == true){
            return true;
        }
        this._open();
    }
    
   
    
    /**
	 * 开启地图的绘制状态
	 * 
	 * @return {Boolean}，开启绘制状态成功，返回true；否则返回false。
	 */
    MapPolygonDrawingTool.prototype._open = function() {

        this._isOpen = true;

        // 添加遮罩，所有鼠标操作都在这个遮罩上完成
        if (!this._mask) {
            this._mask = new Mask();
        }
        this._map.addOverlay(this._mask);
    }
    
    /**
     * 关闭地图的绘制状态
     *
     * @example <b>参考示例：</b><br />
     * myMapPolygonDrawingTool.close();
     */
    MapPolygonDrawingTool.prototype.close = function() {
        // 判断绘制状态是否已经开启
        if (this._isOpen == false){
            return true;
        }
        this._close();
    }
    
    /**
     * 关闭地图的绘制状态
     * @return {Boolean}，关闭绘制状态成功，返回true；否则返回false。
     */
    MapPolygonDrawingTool.prototype._close = function() {
        this._isOpen = false;
        if (this._mask) {
            this._map.removeOverlay(this._mask);
            this._mask=null;
        }
    }
    
    
    MapPolygonDrawingTool.prototype.clear=function(){
    	var map = this._map,
    		overlay = this.overlay;
    	this.close();
    	if(overlay!=null){
    		overlay.enableMassClear();
			map.removeOverlay(overlay);
			overlay=null;
		}
    }
    
    MapPolygonDrawingTool.prototype.getPath=function(){
    	var overlay = this.overlay;
    	if(overlay!=null){
			return overlay.getPath();
		}
    	return null;
    }
    
    /**
     * 画多边形
     */
    MapPolygonDrawingTool.prototype._bindAdd = function() {
		var me = this,
			opt=this._opts,
			map = this._map, 
			mask = this._mask, 
			points = [], // 用户绘制的点
			drawPoint = null; // 实际需要画在地图上的点
			overlay = this.overlay, 
			isBinded = false,
			polygonStyle = this._opts.polygonStyle|| {strokeColor:'#000'};
		
		/**
		 * 鼠标点击的事件
		 */
		var startAction = function(e) {
			points.push(e.point);
			drawPoint = points.concat(points[points.length - 1]);
			if (points.length == 1) {
				me.overlay = new BMap.Polygon(drawPoint, polygonStyle);
				me.overlay.disableMassClear();
				me.overlay.mydata = new Object();
				me.overlay.mydata.type = "new";
				map.addOverlay(me.overlay);
			} else {
				me.overlay.setPath(drawPoint);
			}
			if (!isBinded) {
				isBinded = true;
				mask.enableEdgeMove();
				mask.addEventListener('mousemove', mousemoveAction);
				mask.addEventListener('dblclick', dblclickAction);
			}
		}

		/**
		 * 鼠标移动过程的事件
		 */
		var mousemoveAction = function(e) {
			me.overlay.setPositionAt(drawPoint.length - 1, e.point);
		}

		/**
		 * 鼠标双击的事件
		 */
		var dblclickAction = function(e) {
			
			baidu.stopBubble(e);
			isBinded = false;
			mask.disableEdgeMove();
			mask.removeEventListener('mousedown', startAction);
			mask.removeEventListener('mousemove', mousemoveAction);
			mask.removeEventListener('dblclick', dblclickAction);
			if (me._controlButton == "right") {
				points.push(e.point);
			} else if (baidu.ie <= 8) {
			} else {
				points.pop();
			}
			me.overlay.setPath(points);
			points.length = 0;
			drawPoint.length = 0;
			me.close();
			me.overlay.enableEditing();
			if(opt["lineupdate"] instanceof Function){
				opt["lineupdate"](me.overlay);
				me.overlay.addEventListener("lineupdate",opt["lineupdate"]);
			}
		}

		mask.addEventListener('mousedown', startAction);

		// 双击时候不放大地图级别
		mask.addEventListener('dblclick', function(e) {
			baidu.stopBubble(e);
		});
		
		return overlay;
	}
	  

   
    
    
    
    
    
    
    
    
    
    
    
    
    /**
	 * 创建遮罩对象
	 */
    function Mask(){
        /**
		 * 鼠标到地图边缘的时候是否自动平移地图
		 */
        this._enableEdgeMove = false;
    }

    Mask.prototype = new BMap.Overlay();

    /**
	 * 这里不使用api中的自定义事件，是为了更灵活使用
	 */
    Mask.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
    Mask.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
    Mask.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;

    Mask.prototype.initialize = function(map){
        var me = this;
        this._map = map;
        var div = this.container = document.createElement("div");
        var size = this._map.getSize();
        div.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + size.width + "px;height:" + size.height + "px";
        this._map.addEventListener('resize', function(e) {
            me._adjustSize(e.size);
        });
        this._map.getPanes().floatPane.appendChild(div);
        this._bind();
        return div; 
    };

    Mask.prototype.draw = function() {
        var map   = this._map,
            point = map.pixelToPoint(new BMap.Pixel(0, 0)),
            pixel = map.pointToOverlayPixel(point);
        this.container.style.left = pixel.x + "px";
        this.container.style.top  = pixel.y + "px"; 
    };

    /**
     * 开启鼠标到地图边缘，自动平移地图
     */
    Mask.prototype.enableEdgeMove = function() {
        this._enableEdgeMove = true;
    }

    /**
     * 关闭鼠标到地图边缘，自动平移地图
     */
    Mask.prototype.disableEdgeMove = function() {
        clearInterval(this._edgeMoveTimer);
        this._enableEdgeMove = false;
    }

    /**
     * 绑定事件,派发自定义事件
     */
    Mask.prototype._bind = function() {

        var me = this,
            map = this._map,
            container = this.container,
            lastMousedownXY = null,
            lastClickXY = null;

        /**
         * 根据event对象获取鼠标的xy坐标对象
         * @param {Event}
         * @return {Object} {x:e.x, y:e.y}
         */
        var getXYbyEvent = function(e){
            return {
                x : e.clientX,
                y : e.clientY
            }
        };

        var domEvent = function(e) {
            var type = e.type;
                e = baidu.getEvent(e);
                point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标

            var dispatchEvent = function(type) {
                e.point = point;
                me.dispatchEvent(e);
            }

            if (type == "mousedown") {
                lastMousedownXY = getXYbyEvent(e);
            }

            var nowXY = getXYbyEvent(e);
            //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
            if (type == "click") {
                //鼠标点击过程不进行移动才派发click和dblclick
                if (Math.abs(nowXY.x - lastMousedownXY.x) < 5 && Math.abs(nowXY.y - lastMousedownXY.y) < 5 ) {
                    if (!lastClickXY || !(Math.abs(nowXY.x - lastClickXY.x) < 5 && Math.abs(nowXY.y - lastClickXY.y) < 5)) {
                        dispatchEvent('click');
                        lastClickXY = getXYbyEvent(e);
                    } else {
                        lastClickXY = null;
                    }
                }
            } else {
                dispatchEvent(type);
            }
        }

        /**
         * 将事件都遮罩层的事件都绑定到domEvent来处理
         */
        var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
            index = events.length;
        while (index--) {
            baidu.on(container, events[index], domEvent);
        }

        //鼠标移动过程中，到地图边缘后自动平移地图
        /*baidu.on(container, 'mousemove', function(e) {
            if (me._enableEdgeMove) {
                me.mousemoveAction(e);
            }
        });*/
    };

    //鼠标移动过程中，到地图边缘后自动平移地图
    Mask.prototype.mousemoveAction = function(e) {
        function getClientPosition(e) {
            var clientX = e.clientX,
                clientY = e.clientY;
            if (e.changedTouches) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
            return new BMap.Pixel(clientX, clientY);
        }

        var map       = this._map,
            me        = this,
            pixel     = map.pointToPixel(this.getDrawPoint(e)),
            clientPos = getClientPosition(e),
            offsetX   = clientPos.x - pixel.x,
            offsetY   = clientPos.y - pixel.y;
        pixel = new BMap.Pixel((clientPos.x - offsetX), (clientPos.y - offsetY));
        this._draggingMovePixel = pixel;
        var point = map.pixelToPoint(pixel),
            eventObj = {
                pixel: pixel,
                point: point
            };
        // 拖拽到地图边缘移动地图
        this._panByX = this._panByY = 0;
        if (pixel.x <= 20 || pixel.x >= map.width - 20
            || pixel.y <= 50 || pixel.y >= map.height - 20) {
            if (pixel.x <= 20) {
                this._panByX = 8;
            } else if (pixel.x >= map.width - 20) {
                this._panByX = -8;
            }
            if (pixel.y <= 50) {
                this._panByY = 8;
            } else if (pixel.y >= map.height - 20) {
                this._panByY = -8;
            }
            if (!this._edgeMoveTimer) {
                this._edgeMoveTimer = setInterval(function(){
                    map.panBy(me._panByX, me._panByY, {"noAnimation": true});
                }, 30);
            }
        } else {
            if (this._edgeMoveTimer) {
                clearInterval(this._edgeMoveTimer);
                this._edgeMoveTimer = null;
            }
        }
    }

    /*
     * 调整大小
     * @param {Size}
     */
    Mask.prototype._adjustSize = function(size) {
        this.container.style.width  = size.width + 'px';
        this.container.style.height = size.height + 'px';
    };

    /**
     * 获取当前绘制点的地理坐标
     *
     * @param {Event} e e对象
     * @return Point对象的位置信息
     */
    Mask.prototype.getDrawPoint = function(e) {
        var map = this._map,
        trigger = baidu.getTarget(e),
        x = e.offsetX || e.layerX || 0,
        y = e.offsetY || e.layerY || 0;
        if (trigger.nodeType != 1) trigger = trigger.parentNode;
        while (trigger && trigger != map.getContainer()) {
            if (!(trigger.clientWidth == 0 &&
                trigger.clientHeight == 0 &&
                trigger.offsetParent && trigger.offsetParent.nodeName == 'TD')) {
                x += trigger.offsetLeft || 0;
                y += trigger.offsetTop || 0;
            }
            trigger = trigger.offsetParent;
        }
        var pixel = new BMap.Pixel(x, y);
        var point = map.pixelToPoint(pixel);
        return point;
    }
    
    
    

    
    
})();