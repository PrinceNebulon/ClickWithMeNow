var chatWindow;
var submitButton;

function findChatComponents(){
	chatWindow = $('body').find("#chatTranscriptMessage");
	console.debug("chatWindow=" + chatWindow);

	submitButton = $('body').find(".chat-action-list").find('button');
	console.debug("submitButton=" + submitButton);
}

function sendToChat(message) {
	findChatComponents();
	chatWindow.val(message).focus();
	submitButton.click();
}