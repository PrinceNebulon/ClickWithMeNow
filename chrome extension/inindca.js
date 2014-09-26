var cwmnInstance;
var chatWindow;
var pubLink;
var chatWindow;

console.debug("Test addin loaded")

setTimeout(function(){
	console.debug("Adding content")


	//var chatWindow = $("#ember1287");
	chatWindow = $('body').find(".chat-conversation");
	console.debug("chatWindow=" + chatWindow);
	//chatWindow.append('<img id="img1" src="' + chrome.extension.getURL("icon_16.png") + '" width="16" height="16" />');

	//$("#ember1285").find(".input-group").append('<iframe id="cwmniframe" width="150" height="50"></iframe>');
	//$("#cwmniframe").contents().find('html').html('<a javascript:void(0)>asdf</a>');
	//$("#cwmniframe").contents().find('head').append('<link href="' + chrome.extension.getURL("iframecss.css") + '" type="text/css" rel="Stylesheet" />');
	//$("#cwmn-panel").hide();

	chatWindow.find(".input-group").append('<nav id="cwmnagentmenu"><ul><li><a javascript:void(0) id="cwmnMenuButton"></a><ul class="cwmnMenuL1"><li><a javascript:void(0)>I want to <strong>HOST</strong></a><ul class="cwmnMenuL2"><li><a href="javascript:void(0)" id="cwmnShowHomeLink">Home page</a></li><li><a href="javascript:void(0)" id="cwmnShowRegisterDemoLink">PureCloud Demo Signup</a></li><li><a href="javascript:void(0)" id="cwmnShowPressReleasesLink">Press releases</a></li></ul></li><li><a javascript:void(0)>I want to <strong>WATCH</strong></a><ul><li><a href="javascript:void(0)" id="cwmnSeeHomeLink">Home page</a></li><li><a href="javascript:void(0)" id="cwmnSeeRegisterDemoLink">PureCloud Demo Signup</a></li><li><a href="javascript:void(0)" id="cwmnSeePressReleasesLink">Press releases</a></li></ul></li></ul></li></ul></nav>');


	Setup();

	
	
}, 8000);



function Setup() {
    $("#cwmnShowHomeLink").click(invokeShowHome);
    $("#cwmnShowRegisterDemoLink").click(invokeShowRegisterDemo);
    $("#cwmnShowPressReleasesLink").click(invokeShowPressReleases);

    $("#cwmnSeeHomeLink").click(invokeSeeHome);
    $("#cwmnSeeRegisterDemoLink").click(invokeSeeRegisterDemo);
    $("#cwmnSeePressReleasesLink").click(invokeSeePressReleases);

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
function invokeShowHome() {
	console.debug('invokeShowHome');
	inviteToWatch('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeShowRegisterDemo() {
	console.debug('invokeShowRegisterDemo');
	inviteToWatch('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}

function invokeShowPressReleases() {
	console.debug('invokeShowPressReleases');
	inviteToWatch('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

// See methods
function invokeSeeHome() {
	console.debug('invokeSeeHome');
	inviteToHost('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeSeeRegisterDemo() {
	console.debug('invokeSeeRegisterDemo');
	inviteToHost('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}


function invokeSeePressReleases() {
	console.debug('invokeSeePressReleases');
	inviteToHost('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

function inviteToHost(url) {
	console.debug('inviteToHost: ' + url);
	sendToChat(url);
	return;
	cwmnInstance.sessionAPI.inviteToHost({
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

function inviteToWatch(url) {
	console.debug('inviteToWatch: ' + url);
	sendToChat(url);
	return;
	cwmnInstance.sessionAPI.inviteToHost({
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
    
function startCwmnSession() {
    cwmnInstance.sessionAPI.initializeScreen({
        hostName: 'T-host',
        hostEmail: 'tim.smith@inin.com'
    }, function() {
        cwmnInstance.publicLink.activate();
        pubLink = cwmnInstance.publicLink.generate();
        cwmnInstance.UI.startHosting();
        SetLink();
    });
}

function SetLink() {
    var inSession = cwmnInstance.userData.screenId != '';
    if (!inSession) return;
	$('#ember1347').val(pubLink);
    setTimeout(function() { $("#ember1347").find(".input-group").find('button').click(); }, 500);
}