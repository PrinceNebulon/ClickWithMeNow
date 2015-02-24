$(document).ready(function() {
    $("#colorer").click(function(){
        test();
        window.close();
    }); 
});

function test(){
	chrome.tabs.executeScript(null,{
		code:"fade();function fade(){$('body').animate({backgroundColor: makeColor()},2000);$('div').each(function(index){var bgColor=makeColor();var textColor=invertColor(bgColor);$(this).animate({backgroundColor:bgColor,color:textColor},2000)});setTimeout(fade,2200)}function makeColor(){return'#'+Math.floor(Math.random()*16777215).toString(16)}function invertColor(hexTripletColor){var color=hexTripletColor;color=color.substring(1);color=parseInt(color,16);color=0xFFFFFF^color;color=color.toString(16);color=('000000'+color).slice(-6);color='#'+color;return color}"
	});
}

function fade(){
	$('body').animate({backgroundColor: makeColor()}, 2000);
	$('div').each(function(index){
		var bgColor = makeColor();
		var textColor = invertColor(bgColor);
		$(this).animate({
			backgroundColor: bgColor,
			color: textColor
		}, 2000);
	});

	setTimeout(fade, 2200);
}

function makeColor(){
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);
    color = parseInt(color, 16);
    color = 0xFFFFFF ^ color;
    color = color.toString(16);
    color = ('000000' + color).slice(-6);
    color = '#' + color;
    return color;
}