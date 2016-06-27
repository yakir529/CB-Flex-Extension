//------------------------------------------------// GLOBE //-----------------------------------
if (!String.prototype.format) {
	String.prototype.format = function () {
		var str = this.toString();
		if (!arguments.length)
			return str;
		var argumentsToReturn = typeof arguments[0];

		argumentsToReturn = (("string" === argumentsToReturn || "number" === argumentsToReturn) ? arguments : arguments[0]);

		return str.replace(/\{([0-9]+)\}/g, function (key, val) {
			return argumentsToReturn[val];
		});
	};
}

var browser = getBrowser(),
	FlexObjLib = FlexObjLib || {};

//---------------------------------------------/ Aid funcs
function getBrowser(){
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
	if(/trident/i.test(M[1])){
		tem = /\brv[ :]+(\d+)/g.exec(ua) || []; 
		return { name:'IE ',version:(tem[1]||'') };
	}   
	
	if(M[1]==='Chrome'){
	    tem = ua.match(/\bOPR\/(\d+)/);
	    if (tem !== null) {
	        return { name: 'Opera', version: tem[1] };
	    }
	}   
	
	M = M[2] ? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	
	if((tem=ua.match(/version\/(\d+)/i)) !== null) M.splice(1,1,tem[1]);
	
	return {
		name: M[0],
		version: M[1]
	};
}

function getUserAlign(obj) {
	var res = $(obj).attr('data-align-items');
	if (res === 'default' || typeof res === 'undefined') res = 'center';
	return res;
}

function getUserDirection(obj) {
	var res = $(obj).attr('data-flex-direction');
	if (res === 'default' || typeof res === 'undefined') res = 'row';
	return res;
}

function getUserJustify(obj) {
	var res = $(obj).attr('data-justify-content');
	if (res === 'default' || typeof res === 'undefined') res = 'space-around';
	return res;
}

function getUserWrap(obj) {
	var res = $(obj).attr('data-wrap');
	if (res === 'default' || typeof res === 'undefined' || res === 'wrap' || res === 'wrap_default' || res === 'default_wrap' || res === '') res = 'wrap';
	else res = 'nowrap';
	return res;
}

function getUserFlexOrder(obj) {
	var resStr = '',
		primStr = $(obj).attr('style');
	
	if (primStr === undefined || primStr === '') {
		resStr = '0';
	} else if (primStr.indexOf('order:') > -1 ) {
		resStr = primStr.substring(primStr.indexOf('order:') + ('order:').length, primStr.indexOf('order:') + primStr.length + 3);
		resStr = resStr.match(/\d/g).join("");
	} else if (primStr.indexOf('group:') > -1 ) {
		resStr = primStr.substring(primStr.indexOf('group:') + ('group:').length, primStr.indexOf('group:') + primStr.length + 3);
		resStr = resStr.match(/\d/g).join("");
	} else {
		resStr = '1';
	}
	
	return resStr;
}

function getUserParentFlexProperty(obj) {
	var res = $(obj).attr('data-flex-parent');
	if (res === 'default' || typeof res === 'undefined') res = '0 0 auto';
	return res;
}

function getUserChildFlexProperty(childNum, obj) {
	var res = $(obj).attr('data-flex-child');

	if (res === 'default' || typeof res === 'undefined') {
		res = '0 0 auto';
	} else {
		var newRes = res.split('_');

		if (newRes.length === 0) res = '0 0 auto';
		else if (newRes.length === $(obj).children().length) res = newRes[childNum - 1];
		else if (newRes.length === 1 && $(obj).children().length > 1) res = newRes[0];
		else res = '0 0 auto';
	}

	return res;
}

function getUserWrapWidth(obj) {
	var res = $(obj).attr('data-wrap-width');
	if (res === 'default' || res === '' || typeof res === 'undefined') res = 700;
	else res = parseInt(res);
	return res;
}

//------------------------------------------------// ENGINE //--------------------------------------
FlexObjLib.ParentBox = (function () {
	function ParentBox(obj) {//----/ Ctor
		var childrenArr = [];
		this._childrenArr = childrenArr;

		this._obj = obj;
		this._alignItems = getUserAlign(obj);
		this._justifyContent = getUserJustify(obj);
		this._flexDirection = getUserDirection(obj);
		this._flexWrap = getUserWrap(obj);
		this._wrapWidth = getUserWrapWidth(obj);
		this._flexOrder = getUserFlexOrder(obj);
		this._flex = getUserParentFlexProperty(obj);

		if (browser.name === 'Firefox' && browser.version <= '28') this._obj.style.display = '-moz-groupbox';
		else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) this._obj.style.display = '-webkit-flex';
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) this._obj.style.cssText = 'display: -ms-flexbox';
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version === 10) this._obj.style.cssText = 'display: flex';
		else if (browser.name === 'Safari') this._obj.style.display = '-webkit-box';
		else this._obj.style.display = 'flex';
		
		for (var i = 1; i <= $(obj).children().length ; i++) {
			var newChild = new FlexObjLib.ChildBox($(obj).children()[i-1]);
			newChild.setChildBoxOrder(i);
			newChild.setChildBoxFlex(getUserChildFlexProperty(i,newChild.getChildBoxObj().parentElement));
			this._childrenArr.push(newChild);
		}
		
	}

	ParentBox.prototype.appendAlignItems = function (dir) {//----/ Methods 
		var attr = '';

		if (browser.name === 'Firefox' && browser.version <= '28') attr = '-moz-box-align';
		else if (browser.name === 'Firefox' && (dir === 'start' || dir === 'end')) {
			attr = 'align-items';
			dir = 'flex-{0}'.format([dir]);
		}
		else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) {
			attr = '-webkit-align-items';
			if (dir === 'start' || dir === 'end') dir = 'flex-{0}'.format([dir]);
			
		}
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-align';
		else if (browser.name === 'MSIE' || browser.name === 'IE ') {
			attr = 'align-items';
			if (dir === 'start' || dir === 'end') dir = 'flex-{0}'.format([dir]);
		}
		else if (browser.name === 'Safari') attr = '-webkit-box-align';
		else attr = 'align-items';

		if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10) {
			var currStyle = this._obj.style.cssText;
			this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle,attr,dir]);
		} else {
			$(this._obj).css(attr, dir);
		}

	};

	ParentBox.prototype.appendJustify = function (dir) {
		var attr = '';

		if (browser.name === 'Firefox' && browser.version <= '28') attr = '-moz-box-pack';
		else if (browser.name === 'Firefox' && (dir === 'start' || dir === 'end')) {
			attr = 'justify-content';
			dir = 'flex-{0}'.format([dir]);
		}
		else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) {
			attr = '-webkit-justify-content';
			if (dir === 'start' || dir === 'end') dir = 'flex-{0}'.format([dir]);
		}
		else if (browser.name === 'Safari') {
			attr = '-webkit-box-pack';
			if (dir === 'space-between') dir = 'justify';
			else if (dir === 'space-around') dir = 'center';
		}
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-pack';
		else if (browser.name === 'MSIE' || browser.name === 'IE ') {
			attr = 'justify-content';
			if (dir === 'start' || dir === 'end') dir = 'flex-{0}'.format([dir]);
		}
		else attr = 'justify-content';

		if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10) {
			var currStyle = this._obj.style.cssText;
			this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle,attr,dir]);
		} else {
			$(this._obj).css(attr, dir);
		}

		if (browser.name === 'Safari' && browser.version < 6) {
			switch (dir) {
				case 'space-around':
					$(this._obj).css({
						'-webkit-box-pack': 'center',
						'-webkit-box-align': 'center',
						'-moz-box-align': 'center',
						'-moz-box-pack': 'center'
					});
					break;
				case 'space-between':
					$(this._obj).css({
						'-webkit-box-pack': 'justify',
						'-webkit-box-align': 'stretch',
						'-moz-box-align': 'stretch',
						'-moz-box-pack': 'justify'
					});
					break;
			}
		}
	};

	ParentBox.prototype.appendDirection = function ( dir ) {
		var attr = '';

		if (browser.name === 'Firefox' && browser.version <= '28') attr = '-moz-box-orient';
		else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-flex-direction';
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-direction';
		else attr = 'flex-direction';

		if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10) {
			var currStyle = this._obj.style.cssText;
			this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle,attr,dir]);
		} else {
			$(this._obj).css(attr, dir);
		}
		
		if (browser.name === 'Safari' && browser.version < 6) {
			switch (dir) {
				case 'row':
					$(this._obj).css({
						'-webkit-box-orient': 'horizontal',
						'-webkit-box-direction': 'normal'
					});
					break;
				case 'row-reverse':
					$(this._obj).css({
						'-webkit-box-orient': 'horizontal',
						'-webkit-box-direction': 'reverse'
					});
					break;
				case 'column':
					$(this._obj).css({
						'-webkit-box-orient': 'vertical',
						'-webkit-box-direction': 'normal'
					});
					break;
				case 'column-reverse':
					$(this._obj).css({
						'-webkit-box-orient': 'vertical',
						'-webkit-box-direction': 'reverse'
					});
					break;
				case 'initial':
					$(this._obj).css({
						'-webkit-box-orient': 'initial',
						'-webkit-box-direction': 'initial'
					});
					break;
				case 'inherit':
					$(this._obj).css({
						'-webkit-box-orient': 'inherit',
						'-webkit-box-direction': 'inherit'
					});
					break;
				default:
					$(this._obj).css({
						'-webkit-box-orient': 'none',
						'-webkit-box-direction': 'none'
					});
					break;
			}
		}
	};

	ParentBox.prototype.appendFlexWrap = function ( dir ) {
		var attr = '';

		if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-flex-wrap';
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-wrap';
		else attr = 'flex-wrap';

		if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10) {
			var currStyle = this._obj.style.cssText;
			this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle,attr,dir]);
		} else {
			$(this._obj).css(attr, dir);
		}
	};

	ParentBox.prototype.appendFlexOrder = function ( i_OrderNum ) {
		var attr = '';

		if (browser.name === 'Firefox' && browser.version <= '28') attr = '-moz-box-ordinal-group';
		else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-order';
		else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-order';
		else if (browser.name === 'Safari') attr = '-webkit-box-ordinal-group';
		else attr = 'order';

		if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10 && (this._obj.style.cssText === undefined || this._obj.style.cssText.indexOf('{0}: {1};'.format([attr, i_OrderNum])) === -1 )) {
			this._obj.style.cssText = '{0} {1}: {2};'.format([this._obj.style.cssText, attr, i_OrderNum]);
		} else if (browser.name === 'Safari' && browser.version < 6) {
			var currStyle = $(this._obj).attr('style');
			
			if (currStyle === undefined) $(this._obj).attr('style', '{0}:{1};'.format([attr,i_OrderNum]));
			else if (currStyle.indexOf('{0}:{1};'.format([attr,i_OrderNum])) === -1 ) $(this._obj).attr('style', '{0} {1}: {2};'.format([currStyle, attr, i_OrderNum])); 
			
		} else if ($(this._obj).attr('style') === undefined || $(this._obj).attr('style').indexOf('{0}: {1};'.format([attr, i_OrderNum])) === -1) {
			$(this._obj).css(attr, '' + i_OrderNum + '');
		}
	};

	ParentBox.prototype.appendFlexProperty = function (dir) {
		var attr = '';

		if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-flex';
		else if (browser.name === 'Safari') attr = '-webkit-box-flex';
		else attr = 'flex';

		if (browser.name === 'MSIE' && browser.version <= 10) {
			var currStyle = this._obj.style.cssText;
			this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle,attr,dir]);
		} else {
			$(this._obj).css(attr, dir);
		}
	};

	ParentBox.prototype.appendChildrenOrder = function () {
		$.each(this._childrenArr, function () {
			this.appendChildOrder();
		});
	};

	ParentBox.prototype.appendChildrenFlex = function () {
		$.each(this._childrenArr, function () {
			this.appendChildFlex();
		});
	};

	ParentBox.prototype.addChild = function (childToAdd) {
		this._childrenArr.push(childToAdd);
	};

	ParentBox.prototype.removeChild = function (childToRemove, pos) {
		this._childrenArr.splice(childToRemove, pos);
	};

	ParentBox.prototype.getAlignItems = function () {//----/ Getters 
		return this._alignItems;
	};

	ParentBox.prototype.getJustify = function () {
		return this._justifyContent;
	};

	ParentBox.prototype.getDirection = function () {
		return this._flexDirection;
	};

	ParentBox.prototype.getWrap = function () {
		return this._flexWrap;
	};

	ParentBox.prototype.getWrapWidth = function () {
		return this._wrapWidth;
	};

	ParentBox.prototype.getOrder = function () {
		return this._flexOrder;
	};

	ParentBox.prototype.getFlexProperty = function () {
		return this._flex;
	};

	ParentBox.prototype.getBoxObj = function () {
		return this._obj;
	};

	ParentBox.prototype.getChildren = function () {
		return this.childrenArr;
	};

	ParentBox.prototype.setAlignItems = function (prop) {//----/ Setters
		this._alignItems = prop;
	};

	ParentBox.prototype.setJustify = function (prop) {
		this._justifyContent = prop;
	};

	ParentBox.prototype.setDirection = function (prop) {
		this._flexDirection = prop;
	};

	ParentBox.prototype.setWrap = function (prop) {
		this._flexWrap = prop;
	};

	ParentBox.prototype.setWrapWidth = function (prop) {
		this._wrapWidth = prop;
	};

	ParentBox.prototype.setOrder = function (prop) {
		this._flexOrder = prop;
	};

	ParentBox.prototype.setFlexProperty = function (prop) {
		this._flex = prop;
	};
	
	return ParentBox;
})();

FlexObjLib.ChildBox = (function () {
	function ChildBox(obj) {//----/ Ctor
		this._obj = obj;
		this._order = '';
		this._flex = '';
	}

	ChildBox.prototype.appendChildFlex = function () {//----/ Methods
		if (this.getChildBoxFlex() !== '') {
			var attr = '';

			if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-flex';
			else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex';
			else attr = 'flex';

			if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10) {
				var currStyle = this._obj.style.cssText;
				this._obj.style.cssText = '{0} {1}: {2};'.format([currStyle, attr, this.getChildBoxFlex()]);
			} else {
				$(this._obj).css(attr, '{0}'.format([this.getChildBoxFlex()]));
			}
		}
	};

	ChildBox.prototype.appendChildOrder = function () {
		var orderNum = this.getChildBoxOrder();
		
		if (orderNum !== '') {
			var attr = '';

			if (browser.name === 'Firefox' && browser.version <= '28') attr = '-moz-box-ordinal-group';
			else if (browser.name === 'Chrome' || (browser.name === 'Safari' && browser.version >= 6)) attr = '-webkit-order';
			else if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version < 10) attr = '-ms-flex-order';
			else if (browser.name === 'Safari') attr = '-webkit-box-ordinal-group';
			else attr = 'order';

			if ((browser.name === 'MSIE' || browser.name === 'IE ') && browser.version <= 10 && (this._obj.style.cssText === undefined || this._obj.style.cssText.indexOf('{0}: {1};'.format([attr, orderNum]) === -1 ))) {
				this._obj.style.cssText = '{0} {1}: {2};'.format([this._obj.style.cssText, attr, orderNum]);
			} else if (browser.name === 'Safari' && browser.version < 6) {
				var currStyle = $(this._obj).attr('style');
				
				if (currStyle === undefined) $(this._obj).attr('style', '{0}: {1};'.format([attr,orderNum]));
				else if (currStyle.indexOf('{0}: {1};'.format([attr,orderNum])) === -1 ) $(this._obj).attr('style', '{0} {1}: {2};'.format([currStyle, attr, orderNum])); 
				
			} else if ($(this._obj).attr('style') === undefined || $(this._obj).attr('style').indexOf('{0}: {1};'.format([attr, orderNum])) === -1) {
				$(this._obj).css(attr, '{0}'.format([orderNum]));
			}
		}
	};

	ChildBox.prototype.getChildBoxObj = function () {//----/ Getters
		return this._obj;
	};

	ChildBox.prototype.getChildBoxOrder = function () {
		return this._order;
	};

	ChildBox.prototype.getChildBoxFlex = function () {
		return this._flex;
	};

	ChildBox.prototype.setChildBoxObj = function (obj) {//----/ Setters
		this._obj = obj;
	};

	ChildBox.prototype.setChildBoxOrder = function (order) {
		this._order = order;
	};

	ChildBox.prototype.setChildBoxFlex = function (flex) {
		this._flex = flex;
	};

	return ChildBox;
})();

FlexObjLib.FlexPan = (function () {
	function FlexPan() {//----/ Ctor
		var pan = [];
		this._pan = pan;
	}

	FlexPan.prototype.addFlexObj = function (objToAdd) {//----/ Methods
		this._pan.push(objToAdd);
	};

	FlexPan.prototype.removeFlexObj = function (objToRemove, pos) {
		this._pan.splice(objToRemove,pos);
	};

	FlexPan.prototype.appendPropertys = function (i_ParentBox) {
		var sWidth = $(window).width();

		i_ParentBox.appendAlignItems(i_ParentBox.getAlignItems());
		i_ParentBox.appendJustify(i_ParentBox.getJustify());
		i_ParentBox.appendDirection(i_ParentBox.getDirection());
		i_ParentBox.appendFlexWrap(i_ParentBox.getWrap());
		i_ParentBox.appendFlexOrder(i_ParentBox.getOrder());
		i_ParentBox.appendFlexProperty(i_ParentBox.getFlexProperty());

		i_ParentBox.appendChildrenFlex();
		i_ParentBox.appendChildrenOrder();

		if (i_ParentBox.getWrap() === 'wrap' && getUserDirection(i_ParentBox.getBoxObj()) !== 'column' && browser.name === 'Safari' && browser.version < 6) {			
			if (sWidth <= i_ParentBox.getWrapWidth()) {
				i_ParentBox.appendDirection('column');
			} else {
				i_ParentBox.appendDirection('initial');
			}
		}
	};

	FlexPan.prototype.getPan = function () {//----/ Getters
		return this._pan;
	};

	FlexPan.prototype.getPanSize = function () {
		return this._pan.length;
	};

	FlexPan.prototype.resetPan = function () {
		this._pan.splice(0, this._pan.length);
	};

	return FlexPan;
})();


//---------------------------------------------/ Factory
var myFlexPan = new FlexObjLib.FlexPan(),
	appendCbFlexProp = {
		flex: function (i_Elem) {
			var newFlexObj = new FlexObjLib.ParentBox(i_Elem);
			myFlexPan.addFlexObj(newFlexObj);
		
			myFlexPan.appendPropertys(newFlexObj);
		}
	};

//------------------------------------------------// HANDLER //-------------------------------------
$(document).ready(function () {
	$('body').hide();
	
	var myElem = $('*[data-display="flex"]');

	if (myFlexPan.getPanSize() > 0) myFlexPan.resetPan();

	$.each(myElem, function () {
		appendCbFlexProp[$(this).attr('data-display')](this);
	});
	
	$('body').show();
	
	$(window).resize(function(){
		$.each(myElem, function () {
			if ($(this).attr('data-wrap-width') !== undefined) {
				if ($(this).attr('data-wrap-width').match(/\d/g) !== null) appendCbFlexProp[$(this).attr('data-display')](this);
			}
		});
	});
});