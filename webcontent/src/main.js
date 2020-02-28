const cardContent = `
    <h1>title</h1>
    <div class="degree maintemp" id="temp">-</div>
    <div class="degree" id ="tempSet">-</div>
    <div id="onOff">-</div>
    <div id="timer"></div>
    <div class="buttons">
        <button id="btnOn">Aan</button>
        <button id="btnTimer">Timer</button>
        <button id="btnOff">Uit</button>
    </div>
`

// copied from dot-circle-regular.svg (source is fontawesome)
const dot_circle_svg = `
<svg viewBox="0 0 512 512" style="width:15px; height:15px">
    <path
    fill="gray" 
    d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z">
    </path>
</svg>
`
const fire_svg = `
<svg viewBox="0 0 384 512" style="width:15px; height:15px">
<path 
    fill="red" 
    d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z">
</path>
`
const hourglass_svg = `
<svg viewBox="0 0 384 512" style="width:15px; height:15px">
<path 
    fill="red" 
    d="M360 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24zm-75.078 384H99.08c17.059-46.797 52.096-80 92.92-80 40.821 0 75.862 33.196 92.922 80zm.019-256H99.078C91.988 108.548 88 86.748 88 64h208c0 22.805-3.987 44.587-11.059 64z"
</path>
`
function addCard(title, namePrefix) {
    var sectionMain = document.getElementById('mainSection');
    var div = document.createElement('div');

    div.innerHTML = cardContent;
    div.classList.add("card", "card-room");
    div.id = "newcard";

    div.querySelector("#btnOn").onclick = () => actionOn(namePrefix);
    div.querySelector("#btnOff").onclick = () => actionOff(namePrefix);
    div.querySelector("#btnTimer").onclick = () => actionTimer(namePrefix);
    div.querySelector("h1").innerHTML = title;

    var children = div.getElementsByTagName("*");
    for (let child of children) {
        if (child.id) {
            child.id = namePrefix + "-" + child.id;
        }
    }

    sectionMain.appendChild(div);
}

function setElementByID(id, func) {
    var elem = document.getElementById(id);
    if (elem !== null) {
        func(elem);
    }
}

function refreshData() {
    var opts = {
        method: 'GET',
        headers: {}
    };
    fetch('data.json', opts).then(function (response) {
        return response.json();
    })
        .then((body) => renderData(body));
}

function renderData(data) {
    document.getElementById("floor0Heating").innerHTML = data.floor0Heating ? fire_svg : dot_circle_svg;
    document.getElementById("floor1Heating").innerHTML = data.floor1Heating ? fire_svg : dot_circle_svg;
    document.getElementById("PrioSanitary").innerHTML = data.PrioSanitary ? fire_svg : dot_circle_svg;
    var activeSvg = data.PrioSanitary ? hourglass_svg : fire_svg;
    for (var room of data.rooms) {
        setElementByID(room.id + "-temp", (e) => e.innerHTML = room.temp);
        setElementByID(room.id + "-tempSet", (e) => e.innerHTML = room.tempSet);
        setElementByID(room.id + "-onOff", (e) => e.innerHTML = room.onOff ? activeSvg : dot_circle_svg);
        setElementByID(room.id + "-timer", (e) => e.innerHTML = room.timer > 0 ? room.timer + '"' : "");
    }
}
window.onload = function () {
    this.addCard("Living", "liv");
    this.addCard("Badkamer", "bath");
    this.addCard("Room Tine", "room1");
    this.addCard("Room Lenka", "room2");
    this.addCard("Room Lars", "room3");
    this.refreshData();
}

function actionOn(room) {
    console.log("action on handler " + room);
    /// todo: post the action to the server + render the returned data
}
function actionOff(room) {
    console.log("action off handler " + room);
    /// todo: post the action to the server + render the returned data
}
function actionTimer(room) {
    console.log("action timer handler " + room);
    /// todo: post the action to the server + render the returned data
}


/********************************************************************* */
/* TESTCODE 
*/
var counter = 0;
function TestAddCard() {
    counter += 1;
    var myPrefix = "card" + counter;
    console.log("prefix =" + myPrefix)
    addCard(myPrefix);

}