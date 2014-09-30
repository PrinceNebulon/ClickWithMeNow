var cwmnInstance;
var chatWindow;
var pubLink;

$(document).ready(function() {
    console.debug("Document ready!");
    document.getElementById("requestChatLink").addEventListener("click", RequestChat, false);
    //window.loadCwmn = loadCwmn;
});

function loadCwmn() {
    console.debug("loadCwmn");
    var cwmn = new Cwmn({});
    cwmnInstance = cwmn.instance;
    cwmn.init(function() { });
    console.debug("After loadCwmn");
}

function RequestChat() {
    var name = document.getElementById('guestName').value;
    chatWindow = open('chat/chathost.html?chatUsername=' + name, 
        "Chat Window", "resizable=no, width=900, height=560, toolbar=no");
}