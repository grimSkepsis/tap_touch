var cellArray = document.getElementsByClassName("cell");


var gestureEnum = {"touchStart": 0, "touchMove": 1, "touchEnd": 2, "touchHold": 3};
var inputBuffer = [];
var bufferWindow = 1000;
var bufferTimeout;

console.log(cellArray);


//get all cells
//get all/generate all state machines, attach to appropriate cells


//attach mouse move, mouse down, and mouse up event listeners
//tap
//mousedown, mouseup relatively fast


document.addEventListener("touchstart", function () {
    addInputToBuffer(gestureEnum.touchStart);
});
document.addEventListener("touchend", function () {
    addInputToBuffer(gestureEnum.touchEnd);
});
document.addEventListener("touchmove", function () {
    if (inputBuffer[inputBuffer.length - 1] !== gestureEnum.touchMove) {
        addInputToBuffer(gestureEnum.touchMove);
    } else {
        resetBuffer();
    }
});

function resetBuffer() {
    if (bufferTimeout) {
        clearTimeout(bufferTimeout);
    }
    bufferTimeout = setTimeout(resolveBuffer, bufferWindow);
}

function addInputToBuffer(gesture) {
    inputBuffer.push(gesture);
    resetBuffer();
}


function resolveBuffer() {
    console.log(inputBuffer.toString());
    if (inputBuffer[inputBuffer.length - 1] === gestureEnum.touchStart) {
        inputBuffer.push(gestureEnum.touchHold);
        resetBuffer();
        return;
    } else if (inputBuffer[inputBuffer.length - 1] === gestureEnum.touchHold) {
        resetBuffer();
        return;
    }
    console.log("RESOLVING BUFFER!");
    if (inputBuffer.toString() === "0,2,0,2") {
        alert("DOUBLE TAP");
    }
    if (inputBuffer.toString() === "0,2") {
        alert("TAP");
    }
    if (inputBuffer.toString() === "0,1,2") {
        alert("SWIPE");
    }
    if (inputBuffer.toString() === "0,3,2") {
        alert("PRESS");
    }
    inputBuffer = [];
}

//double tap
//mousedown, mouseup, mousedown, mouseup relatively fast
//press
//mousedown, pause, mouseup
//swipe
//mousedown, change in mouse position, mouseup

//when you do ANY gesture enter a buffer state for the current state, where the previous gesture becomes cued for a short time so it can be combo'd with another
//if you have a potential combo look at the entire buffer stack to see if any combos are present
//if not a combo, omit the earliest input, and check if the remainder is a combo, if not

//get current cell
//