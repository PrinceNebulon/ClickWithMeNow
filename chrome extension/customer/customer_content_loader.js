var cwmnInstance;
var chatWindow;
var pubLink;
var chatWindow;
var submitButton;

console.debug("Contact center content loader")

setup();

function setup() {
	console.debug("Set loadCwmn");
    window.loadCwmn = loadCwmn;
	console.debug("After set loadCwmn");
}

function loadCwmn() {
	console.debug("loadCwmn");
    var cwmn = new Cwmn({});
    cwmnInstance = cwmn.instance;
    cwmn.init(function() { });
	console.debug("After loadCwmn");
}

function findChatComponents(){
	chatWindow = $('body').find("input.input-sm");
	console.debug("chatWindow=" + chatWindow);

	submitButton = $('body').find("button.btn-success")
	console.debug("submitButton=" + submitButton);
}

// Show methods
function invokeHostHome() {
	findChatComponents();
	console.debug('invokeHostHome');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeHostRegisterDemo() {
	findChatComponents();
	console.debug('invokeHostRegisterDemo');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}

function invokeHostPressReleases() {
	findChatComponents();
	console.debug('invokeHostPressReleases');
	inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

// See methods
function invokeWatchHome() {
	findChatComponents();
	console.debug('invokeWatchHome');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/index.html');
}

function invokeWatchRegisterDemo() {
	findChatComponents();
	console.debug('invokeWatchRegisterDemo');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');
}


function invokeWatchPressReleases() {
	findChatComponents();
	console.debug('invokeWatchPressReleases');
	inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/pr.html');
}

function inviteOtherToHost(url) {
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
	findChatComponents();
	chatWindow.val(message).focus();
	submitButton.click();
}