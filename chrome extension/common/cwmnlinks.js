var reqId;

$(document).ready(function() {
	console.debug("Register for show link clicks");
	$("#cwmnShowHomeLink").click(function(){joinAsHost('http://tim-cic4su5.dev2000.com/cwmn/index.html')});
	$("#cwmnShowRegisterDemoLink").click(function(){joinAsHost('http://tim-cic4su5.dev2000.com/cwmn/demo2.html')});
	$("#cwmnShowPressReleasesLink").click(function(){joinAsHost('http://tim-cic4su5.dev2000.com/cwmn/pr.html')});

	console.debug("Register for see link clicks");
	$("#cwmnSeeHomeLink").click(function(){joinAsGuest('http://tim-cic4su5.dev2000.com/cwmn/index.html')});
	$("#cwmnSeeRegisterDemoLink").click(function(){joinAsGuest('http://tim-cic4su5.dev2000.com/cwmn/demo2.html')});
	$("#cwmnSeePressReleasesLink").click(function(){joinAsGuest('http://tim-cic4su5.dev2000.com/cwmn/pr.html')});

	reqId = makeReqId();
	console.debug("reqId=" + reqId);
	var webworker = $.get('https://m.clickwith.me/webworker?callback=reqwest_' + reqId)
		.done(function(){console.debug("webworker done"); console.log(webworker);})
		.fail(function(){console.debug("webworker failed");})
});

function parseResponse(result) {
	console.log(result);
	console.log(result.responseText);
	var text = result.responseText;
	text = text.substring(69);
	console.log(text);
	text = text.substring(0, text.length - 2);
	console.log(text);
	var j = JSON.parse(text);
	console.log(j);
	return j;
}

function makeReqId() {
	return '14121126' + Math.floor((Math.random() * 89999) + 10000);
}

function makeRequestUrl(targetUrl) {
	var url = 'https://m.clickwith.me/invite/host?hostName=thehostname&hostEmail=noreply%40clickwithmenow.com&guestName=Click+With+Me+Now+demo&guestEmail=noreply%40clickwithmenow.com&message=You%27re+invited+to+host+a+CWMN+session.&url='+encodeURIComponent(targetUrl)+'&os=Windows&browser_name=ININDemo&browser_vers=1&screenDomain=tim-cic4su5.dev2000.com&callback=reqwest_' + reqId;
	console.debug("Request URL=" + url);
	return url;
}

function openCwmnWindow(url){
	window.open(url, "Click With Me Now", "width=1024,height=768,menubar=no,status=no,titlebar=no");
}

function joinAsHost(url) {
	var result = $.get(makeRequestUrl(url))
		.done(function(){
			console.debug("Request done.");
			var j = parseResponse(result);
			console.debug("Host=" + j.hostLink);
			console.debug("Guest=" + j.inviteLink);
			chrome.tabs.executeScript(null,{
				code:"sendToChat('"+j.inviteLink+"')"
			});
			openCwmnWindow(j.hostLink);
			window.close();
		})
		.fail(function(){console.debug("Request failed.")});
}

function joinAsGuest(url) {
	var result = $.get(makeRequestUrl(url))
		.done(function(){
			console.debug("Request done.");
			var j = parseResponse(result);
			console.debug("Host=" + j.hostLink);
			console.debug("Guest=" + j.inviteLink);
			chrome.tabs.executeScript(null,{
				code:"sendToChat('"+j.hostLink+"')"
			});
			openCwmnWindow(j.inviteLink);
			window.close();
		})
		.fail(function(){console.debug("Request failed.")});
}