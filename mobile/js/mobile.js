var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

//设置页面基本字体大小
(function(){
	var tref;
	var doc = window.document;
	var d = doc.documentElement;
	var meta = doc.querySelector('meta[name="viewport"]');
	var left = 1;
	var width = 1;
	var components = meta.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
	function setup() {
		var originalWidth_ = d.getBoundingClientRect().width;
		if (originalWidth_ / left > 540) {
			originalWidth_ = 540 * left;
		}
		var val = originalWidth_ / 32;
		d.style.fontSize = val + "px";
	}
	width = parseFloat(components[1]);
	left = parseInt(1 / width);
	d.setAttribute("data-dpr", left);
	window.addEventListener("resize", function() {
		clearTimeout(tref);
		tref = setTimeout(setup, 300);
	}, false);
	window.addEventListener("pageshow", function(event) {
		if (event.persisted) {
			clearTimeout(tref);
			tref = setTimeout(setup, 300);
		}
	}, false);
	setup();
})();


function showVideo(url){
	var videowrapEl=$("#videowrap"),videoEl;
	if(isiOS){
		videoEl=videowrapEl.children('video');
		if(!videoEl.attr('src')){
			videoEl.attr('src',url);
		}
		videoEl[0].play();
		return;
	}
	var overlay =videowrapEl.children('.modal-overlay'),modal=videowrapEl.children('.modal');
	videoEl=modal.children('video');
	//if(!videoEl.attr('src')){
		videoEl.attr('src',url);
	//}
	overlay.show();modal.show();
	overlay.addClass('modal-overlay-visible');modal.removeClass('modal-out').addClass('modal-in');
	overlay.on('click', function (e) {
		e.preventDefault();
		overlay.unbind('click');
		videoEl[0].pause();
		overlay.removeClass('modal-overlay-visible');
		transitionEnd(overlay,function (e) {
			overlay.hide();
		});
		modal.removeClass('modal-in').addClass('modal-out');
		transitionEnd(modal,function (e) {
			modal.hide();
		});
	});
	videoEl[0].play();
}

function transitionEnd(dom,callback) {
	var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'], i, j, dom = dom;
	function fireCallBack(e) {
		if (e.target !== this) return;
		callback.call(this, e);
		for (i = 0; i < events.length; i++) {
			dom.off(events[i], fireCallBack);
		}
	}
	if (callback) {
		for (i = 0; i < events.length; i++) {
			dom.on(events[i], fireCallBack);
		}
	}
	return this;
}

var Modal=(function(){

	function createModal(opts){
		var htmlstr='',onOpen=null;
		if(typeof opts === 'string'){
			htmlstr=opts;
		}else{
			htmlstr=opts.html||'';
			onOpen=opts.onOpen;
		}
		var wrap=$('body');
		var html='<div class="modal-overlay"></div><div class="modal">'+htmlstr+'</div>';
		wrap.append(html);
		var overlay =wrap.children('.modal-overlay');
		var modal=wrap.children('.modal');
		onOpen&&onOpen(modal);
		overlay.show();
		modal.show();
		overlay.addClass('modal-overlay-visible');
		modal.removeClass('modal-out').addClass('modal-in');
		overlay.on('click', function (e) {
			e.preventDefault();
			closeModal(modal);
		});
		return modal;
	}
	function closeModal(modal){
		var overlay=modal.parent().children('.modal-overlay:last');
		overlay.removeClass('modal-overlay-visible');
		transitionEnd(overlay,function (e) {
			overlay.remove();
		});
		modal.removeClass('modal-in').addClass('modal-out');
		transitionEnd(modal,function (e) {
			modal.remove();
		});
	}
	/**
	 * msg
	 */
	function showTip(opts){
		var wrapper=$('body');
		var msg='',times=3000;
		if(typeof opts === 'string'){
			msg=opts;
		}else{
			msg=opts.msg;
			times=opts.times||times;
		}
		wrapper.append('<div class="m-tipwinmask"><span class="m-tipwin">'+msg+'</span></div>');
		var tipwin =wrapper.children('.m-tipwinmask:last');
		tipwin.show();
		tipwin.addClass('m-tipwinmask_in');

		var hideTipAlert=function(){
			tipwin.removeClass('m-tipwinmask_in');
			transitionEnd(tipwin,function (e) {
				tipwin.remove();
			});
		};
		var tipshowTimeoutId=setTimeout(function(){
			hideTipAlert();
		},times);
		tipwin.click(function(e){
			e.preventDefault();
			clearTimeout(tipshowTimeoutId);
			hideTipAlert();
		});
	}
	return {
		show:createModal,
		close:closeModal,
		showTip:showTip
	}
})();

//绑定导航事件
$(document).ready(function(){
	var pagemenubtn=$("#pagemenubtn"),pagenav=$("#pagenav"),navlist=pagenav.children('.list');
	var pagenavin=function(v){
		if(v){
			pagenav.addClass('in');
			pagemenubtn.addClass('out');
		}else{
			pagenav.removeClass('in');
			pagemenubtn.removeClass('out');
		}
	};
	pagemenubtn.on('click',function(e){
		e.preventDefault();
		pagenavin(true);
	});
	pagenav.children('.navbg').on("click",function(e){
		e.preventDefault();
		pagenavin(false);
	});
	navlist.children('.close').on("click",function(e){
		e.preventDefault();
		pagenavin(false);
	});
	navlist.children('.item').on("click",function(e){
		pagenavin(false);
	});

});