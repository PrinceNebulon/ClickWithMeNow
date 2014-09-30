var cwmnInstance;
var chatWindow;
var pubLink;
var chatWindow;

console.debug("Directory content loader")

setTimeout(function(){
	console.debug("Adding content");

	chatWindow = $('body').find(".chat-conversation");
	console.debug("chatWindow=" + chatWindow);

	chatWindow.find(".input-group").append('<nav id="cwmnagentmenu"><ul><li><a javascript:void(0) id="cwmnMenuButton"></a><ul class="cwmnMenuL1"><li><a javascript:void(0)>I want to <strong>HOST</strong></a><ul class="cwmnMenuL2"><li><a href="javascript:void(0)" id="cwmnShowHomeLink">Home page</a></li><li><a href="javascript:void(0)" id="cwmnShowRegisterDemoLink">PureCloud Demo Signup</a></li><li><a href="javascript:void(0)" id="cwmnShowPressReleasesLink">Press releases</a></li></ul></li><li><a javascript:void(0)>I want to <strong>WATCH</strong></a><ul><li><a href="javascript:void(0)" id="cwmnSeeHomeLink">Home page</a></li><li><a href="javascript:void(0)" id="cwmnSeeRegisterDemoLink">PureCloud Demo Signup</a></li><li><a href="javascript:void(0)" id="cwmnSeePressReleasesLink">Press releases</a></li></ul></li></ul></li></ul></nav>');


	Setup();
}, 8000);



function Setup() {
	console.debug("Register for show link clicks");
    $("#cwmnShowHomeLink").click(invokeHostHome);
    $("#cwmnShowRegisterDemoLink").click(invokeHostRegisterDemo);
    $("#cwmnShowPressReleasesLink").click(invokeHostPressReleases);

	console.debug("Register for see link clicks");
    $("#cwmnSeeHomeLink").click(invokeWatchHome);
    $("#cwmnSeeRegisterDemoLink").click(invokeWatchRegisterDemo);
    $("#cwmnSeePressReleasesLink").click(invokeWatchPressReleases);

	console.debug("Set loadCwmn");
    window.loadCwmn = loadCwmn;
}

function loadCwmn() {
    var cwmn = new Cwmn({});
    cwmnInstance = cwmn.instance;
    cwmn.init(function() {
    	SetLink();
    });
}

// Show methods
function invokeHostHome() {
	console.debug('invokeHostHome');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeHostRegisterDemo() {
	console.debug('invokeHostRegisterDemo');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}

function invokeHostPressReleases() {
	console.debug('invokeHostPressReleases');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

// See methods
function invokeWatchHome() {
	console.debug('invokeWatchHome');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeWatchRegisterDemo() {
	console.debug('invokeWatchRegisterDemo');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}


function invokeWatchPressReleases() {
	console.debug('invokeWatchPressReleases');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

function inviteOtherToHost(url) {
	console.debug('inviteOtherToHost: ' + url);
	sendToChat(url);
	return;
	cwmnInstance.sessionAPI.inviteOtherToHost({
		hostName: 'customer name',
		hostEmail: 'noreply@inin.com',
		inviteName: 'Agent Name',
		inviteEmail: 'noreply@inin.com',
		message: 'no message',
		url: url
	}, function(result) {
		console.debug(JSON.stringify(result));
		sendToChat('https://ms.clickwith.me/host/' + result.screen.screenId);
		window.open(result.inviteLink);
	}, function(error) {
		console.error(JSON.stringify(error));
	});
}

function inviteOtherToWatch(url) {
	cwmnInstance.sessionAPI.inviteOtherToHost({
		hostName: 'Agent NAme',
		hostEmail: 'noreply@inin.com',
		inviteName: 'Customer Name',
		inviteEmail: 'noreply@inin.com',
		message: 'no message',
		url: url
	}, function(result) {
		console.debug(JSON.stringify(result));
		sendToChat(result.inviteLink);
		window.open('https://ms.clickwith.me/host/' + result.screen.screenId);
	}, function(error) {
		console.error(JSON.stringify(error));
	});
}

function sendToChat(message) {
	chatWindow.find('textarea').val(message).focus();
}