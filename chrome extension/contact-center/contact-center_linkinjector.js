$(document).ready(function() {
	console.debug("Register for show link clicks");
	$("#cwmnShowHomeLink").click(invokeHostHome);
	$("#cwmnShowRegisterDemoLink").click(invokeHostRegisterDemo);
	$("#cwmnShowPressReleasesLink").click(invokeHostPressReleases);

	console.debug("Register for see link clicks");
	$("#cwmnSeeHomeLink").click(invokeWatchHome);
	$("#cwmnSeeRegisterDemoLink").click(invokeWatchRegisterDemo);
	$("#cwmnSeePressReleasesLink").click(invokeWatchPressReleases);
});


// Show methods
function invokeHostHome() {
	console.debug('invokeHostHome');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/index.html');"
	});
	window.close();
}

function invokeHostRegisterDemo() {
	console.debug('invokeHostRegisterDemo');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');"
	});
	window.close();
}

function invokeHostPressReleases() {
	console.debug('invokeHostPressReleases');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToWatch('http://tim-cic4su5.dev2000.com/cwmn/pr.html');"
	});
	window.close();
}

// See methods
function invokeWatchHome() {
	console.debug('invokeWatchHome');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/index.html');"
	});
	window.close();
}

function invokeWatchRegisterDemo() {
	console.debug('invokeWatchRegisterDemo');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/demo2.html');"
	});
	window.close();
}


function invokeWatchPressReleases() {
	console.debug('invokeWatchPressReleases');
	chrome.tabs.executeScript(null,{
		code:"inviteOtherToHost('http://tim-cic4su5.dev2000.com/cwmn/pr.html');"
	});
	window.close();
}