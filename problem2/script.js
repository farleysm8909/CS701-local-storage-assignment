window.onload = init;

// global vars
let myWorker;

function init() {
    const startBtn = document.getElementById("start-btn");
    const rangeBtn = document.getElementById("range-btn");
    startBtn.onclick = startWorker;
    rangeBtn.onclick = sendRangeToWorker;
}

// start the web worker
function startWorker(e) {
    if (myWorker == null) {
        myWorker = new SharedWorker("computeWorker.js");
        myWorker.port.addEventListener("message", handleReceipt, false);
        myWorker.port.start();
    }
}

// handle messages received from the web worker
// store returned JSON object in localStorage
// code modified from https://stackoverflow.com/questions/19635077/adding-objects-to-array-in-localstorage
function handleReceipt(e) {
    let existingData = JSON.parse(localStorage.getItem("results"));
    if (existingData === null) { existingData = []; }
    existingData.push(e.data);
    localStorage.setItem("results", JSON.stringify(existingData));
    displayResult();
}

// updates UI to display most current calculated sum using local storage
function displayResult() {
    let p = document.getElementById("result");
    p.innerHTML = "";
    let total = 0;
    let fetchedData = JSON.parse(localStorage.getItem("results"));
    for (let i = 0; i < fetchedData.length; i++) {
        total += fetchedData[i].result;
    }
    p.innerHTML = "Sum of all computed ranges: " + total;
}

// send message (range) to web worker
function sendRangeToWorker(e) {
    let start_range = Number(document.getElementById("start-range").value);
    let end_range = Number(document.getElementById("end-range").value);
    let data = {
        "start": start_range, 
        "end": end_range
    };

    if (myWorker !== null) {
        myWorker.port.postMessage(data);
    }
}