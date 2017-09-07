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