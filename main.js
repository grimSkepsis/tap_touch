var cellArray = document.getElementsByClassName("cell");

//enums to clean up code a bit
var inputEnum = {"touchStart": 0, "touchMove": 1, "touchEnd": 2, "touchHold": 3};
var gestureEnum = {"tap": 0, "doubleTap": 1, "swipe": 2, "press": 3};
var inputComboEnum = {"tapCombo": "0,2", "swipeCombo":"0,1,2", "pressCombo":"0,3,2"};

//Array buffers individual input events and gestures (gestures = predefined combo of inputs)
var inputBuffer = [];
var gestureBuffer = [];

//Time out windows for gestures and inputs
var gestureWindow = 1000;
var inputWindow = 500;

//Variables for holding the timeout functions for the buffers so they can be cancelled/restarted
var inputTimeout;
var gestureTimeout;


//Add all the event listeners
document.addEventListener("touchstart", function () {
    addInputToBuffer(inputEnum.touchStart);
});
document.addEventListener("touchend", function () {
    addInputToBuffer(inputEnum.touchEnd);
});
document.addEventListener("touchmove", function () {
    if (inputBuffer[inputBuffer.length - 1] !== inputEnum.touchMove) {
        addInputToBuffer(inputEnum.touchMove);
    } else {
        resetInputBuffer();
    }
});

//input event code

function resetInputBuffer() {
    if (inputTimeout) {
        clearTimeout(inputTimeout);
    }
    inputTimeout = setTimeout(resolveInputBuffer, inputWindow);
}

function addInputToBuffer(input) {
    inputBuffer.push(input);
    if(inputBuffer.length >= 2) {
        resolveInputBuffer();
    } else {
        resetInputBuffer();
    }
}

function resolveInputBuffer() {
    //if we have initiated a touchStart and haven't let go yet we are pressing so just push a touchHold input onto the buffer and refresh it
    if (inputBuffer[inputBuffer.length - 1] === inputEnum.touchStart) {
        inputBuffer.push(inputEnum.touchHold);
        resetInputBuffer();
        return;
    }
    //if the last input was a touchHold or touchMove then the user is still pressing/swiping so reset the buffer
    else if (inputBuffer[inputBuffer.length - 1] === inputEnum.touchHold || inputBuffer[inputBuffer.length - 1] === inputEnum.touchMove) {
        resetInputBuffer();
        return;
    }
    parseInputCombo(inputBuffer.toString());
    inputBuffer = [];
}

function parseInputCombo(inputString) {
    if (inputString === inputComboEnum.tapCombo) {
        if(gestureBuffer[gestureBuffer.length - 1] === gestureEnum.tap) {
            addGestureToBuffer(gestureEnum.doubleTap);
        } else {
            addGestureToBuffer(gestureEnum.tap);
        }
    }
    if (inputString === inputComboEnum.swipeCombo) {
        addGestureToBuffer(gestureEnum.swipe)
    }
    if (inputString === inputComboEnum.pressCombo) {
        addGestureToBuffer(gestureEnum.press);
    }
}

//gesture code

function addGestureToBuffer(gesture) {
    gestureBuffer.push(gesture);
    resetGestureBuffer();
}

function resetGestureBuffer() {
    if (gestureTimeout) {
        clearTimeout(gestureTimeout);
    }
    gestureTimeout = setTimeout(resolveGestureBuffer, gestureWindow);
}

function resolveGestureBuffer() {
    console.log("GESTURES: ", gestureBuffer.toString());
    gestureBuffer = [];
}
