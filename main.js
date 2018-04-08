//Collection of cell elements/current cell index
var cellArray = document.getElementsByClassName("cell");
var currentCellIndex = 0;
const MAX_CELLS = 9;

//enums to clean up code a bit
var inputEnum = {"touchStart": 0, "touchMove": 1, "touchEnd": 2, "touchHold": 3};
var gestureEnum = {"tap": 0, "doubleTap": 1, "swipe": 2, "press": 3};
var inputComboEnum = {"tapCombo": "0,2", "swipeCombo": "0,1,2", "pressCombo": "0,3,2"};
var gestureComboEnum = {"tapCombo": "0", "doubleTapCombo": "1", "swipeCombo": "2", "pressCombo": "3", "pressSwipeCombo": "32"};

//Array buffers individual input events and gestures (gestures = predefined combo of inputs)
var inputBuffer = [];
var gestureBuffer = [];

//Time out windows for gestures and inputs
var gestureWindow = 1000;
var inputWindow = 500;

//Variables for holding the timeout functions for the buffers so they can be cancelled/restarted
var inputTimeout;
var gestureTimeout;


//crude function to keep track of what cell we are on between refreshes
window.onload = function () {
    if (window.location.href.toString().split("#cell-").length > 1) {
        currentCellIndex = window.location.href.toString().split("#cell-")[1] - 1;
    }
    console.log("current cell index: ", currentCellIndex);
    navigateToCell(currentCellIndex);
}

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
    if (inputBuffer.length >= 2) {
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
        if (gestureBuffer[gestureBuffer.length - 1] === gestureEnum.tap) {
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
        //alternate code that extends gesture buffer time if more gestures are added to the stack
        // clearTimeout(gestureTimeout);
        return;
    }
    gestureTimeout = setTimeout(resolveGestureBuffer, gestureWindow);
}

function resolveGestureBuffer() {
    gestureTimeout = null;
    updateCells();
    gestureBuffer = [];
}

//cell navigation code
function updateCells() {
    var gestureComboKey = "";
    gestureBuffer.forEach(function (gestureValue, index) {
        //execute the raw input gesture
        parseGestureCombo(gestureValue.toString());
        gestureComboKey += gestureValue;

        if(gestureComboKey.length > 1) {
            //execute any possible combo gesture that might be valid
            parseGestureCombo(gestureComboKey)
        }
    });
}

//Function that turns single gestures and gesture combos into actions
function parseGestureCombo(gestureComboKey) {
    switch(gestureComboKey) {
        case gestureComboEnum.tapCombo:

            break;
        case gestureComboEnum.doubleTapCombo:
            currentCellIndex = 0;
            navigateToCell(currentCellIndex);
            break;
        case gestureComboEnum.swipeCombo:

            break;
        case gestureComboEnum.pressCombo:
            navigateToNextCell();
            break;
        case gestureComboEnum.pressSwipeCombo:
            randomizeCellColor();
            break;
    }
}

function navigateToNextCell() {
    currentCellIndex++;
    if(currentCellIndex === MAX_CELLS) currentCellIndex = 0;
    navigateToCell(currentCellIndex);
}

function navigateToCell(index) {
    location.href = "#";
    location.href = "#" + cellArray[index].id;
    //alternate way to navigate between cells
   // document.getElementById(cellArray[index].id).scrollIntoView();
}

function randomizeCellColor() {
    document.getElementById(cellArray[currentCellIndex].id).style.background ='#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
