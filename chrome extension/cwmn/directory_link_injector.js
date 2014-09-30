var chatWindow;
var submitButton;

function findChatComponents(){
	chatWindow = $('body').find(".chat-conversation").find('textarea');
	console.debug("chatWindow=" + chatWindow);

	//submitButton = $('body').find("button.btn-success")
	//console.debug("submitButton=" + submitButton);
}

function sendToChat(message) {
	findChatComponents();
	chatWindow.val(message).focus();
	//setTimeout(function(){submitButton.click();},1000);
}