// application launched using "python -m http.server 8080" at local project directory via Git Bash

window.onload = init;

// global variables
let src, d_target, r_target, msg, sourceName;

// Code modified from https://stackoverflow.com/questions/51859358/how-to-read-json-file-with-fetch-in-javascript
// populate unordered list with data from json file
function readJson() {
    // http://localhost:8080
    fetch('/partyList.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        this.senators = json;
        let list = document.getElementById("senators-list");
        let arr = this.senators.senators;
        // store all senators in local storage
        localStorage.setItem("senators", JSON.stringify(arr));
        list.innerHTML = "";
        let count = 0;
        // populate html list of senators in local storage
        arr.forEach((senator) => {
            list.innerHTML += `<li draggable="true">${senator.full_name}</li>`;
            count++;
        });
        document.getElementById("msg").innerHTML = `${count} loaded senators`;
    })
    .catch(function () {
        this.dataError = true;
    })
}

function init() {
    // check if any senators have already been dragged/dropped in previous windows/sessions, 
    // reload that former data using localStorage
    let sens_arr = localStorage.getItem("senators"); // grab senators from local storage
    if (sens_arr !== null) {
        sens_arr = JSON.parse(sens_arr);

        let list = document.getElementById("senators-list");
        list.innerHTML = "";
        let count = 0;
        for (let i = 0; i < sens_arr.length; i++) {
            // populate original list using localStorage rather than JSON file if it exists
            list.innerHTML += `<li draggable="true">${sens_arr[i].full_name}</li>`;
            count++;

            // if a senator has voted, put their name in the correct field
            if (sens_arr[i].voted === true) {
                let newEl = document.createElement("li");
                let newElText = document.createTextNode(sens_arr[i].full_name);
                newEl.appendChild(newElText);
                if (sens_arr[i].party_affiliation === "Republican") {
                    document.getElementById("rep-list").appendChild(newEl);
                } else {
                    document.getElementById("dem-list").appendChild(newEl);
                } 
            }
        }
        document.getElementById("msg").innerHTML = `${count} loaded senators`;
    } else {
        // load JSON data from localhost:8080/partyList.json to populate original bulleted list
        readJson();
    } 

    // setup drag events
    src = document.getElementById("senators-list"); // parent of draggable items
    r_target = document.getElementById("rep");
    d_target = document.getElementById("dem");
    msg = document.getElementById("msg");

    // Add event handlers for the source
    src.ondragstart = dragStartHandler;
    src.ondragend = dragEndHandler;
    src.ondrag = dragHandler;

    // Add event handlers for the republican target
    r_target.ondragenter = dragEnterHandler;
    r_target.ondragover = dragOverHandler;
    r_target.ondrop = repDropHandler;

    // Add event handlers for the democrat target
    d_target.ondragenter = dragEnterHandler;
    d_target.ondragover = dragOverHandler;
    d_target.ondrop = demDropHandler;
}

function dragStartHandler(e) {
    e.target.classList.add("dragged");
    // store name of senator being dragged
    sourceName = e.target.textContent;
}

function dragEndHandler(e) {
    let elems = document.querySelectorAll(".dragged");
    for (let i = 0; i < elems.length; i++) {
        elems[i].classList.remove("dragged");
    }
    msg.innerHTML = "Drag ended";
}

function dragHandler(e) {
    msg.innerHTML = "Dragging " + e.target.textContent;
}

function dragEnterHandler(e) {
    msg.innerHTML = "Drag entering " + e.target.textContent;
    e.preventDefault();
}

function dragOverHandler(e) {
    msg.innerHTML = "Drag over " + e.target.textContent;
    e.preventDefault();
}

function demDropHandler(e) {
    let newEl = document.createElement("li");
    let newElText = document.createTextNode(sourceName);
    newEl.appendChild(newElText);
    let sens_arr = JSON.parse(localStorage.getItem("senators")); // grab senators from local storage

    for (let i = 0; i < sens_arr.length; i++) {
        // if the democratic senator being dragged matches one of the local storage senators
        // and they haven't already voted
        if (sourceName === sens_arr[i].full_name && 
        sens_arr[i].party_affiliation === "Democrat" &&
        sens_arr[i].voted === false) {
            document.getElementById("dem-list").appendChild(newEl);
            sens_arr[i].voted = true;
            // update data in localStorage
            localStorage.setItem("senators", JSON.stringify(sens_arr));
            e.preventDefault();
        }
    }
}

function repDropHandler(e) {
    let newEl = document.createElement("li");
    let newElText = document.createTextNode(sourceName);
    newEl.appendChild(newElText);
    let sens_arr = JSON.parse(localStorage.getItem("senators")); // grab senators from local storage

    for (let i = 0; i < sens_arr.length; i++) {
        // if the republican senator being dragged matches one of the local storage senators
        // and they haven't already voted
        if (sourceName === sens_arr[i].full_name && 
        sens_arr[i].party_affiliation === "Republican" && 
        sens_arr[i].voted === false) {
            document.getElementById("rep-list").appendChild(newEl);
            sens_arr[i].voted = true;
            // update data in localStorage
            localStorage.setItem("senators", JSON.stringify(sens_arr));
            e.preventDefault();
        }
    }
}