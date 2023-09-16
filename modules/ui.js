import * as Chirp from "./chirp.js";
import * as UV17Pro from "./uv17pro.js";
import * as Main from "./main.js";

function createCard(c, index) {
  let cardHTML = `<span id="ch-index${index}" class="ch-index">${
    index + 1
  }</span>`;
  cardHTML += `<label for"rxFreq${index}">Rx Freq</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="rxFreq${index}" name="rxFreq" value="${c.rxFreq}" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  cardHTML += `<label for"rxCtsDcs${index}">Rx QT/DQT</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="rxCtsDcs${index}" name="rxCtsDcs" value="${c.strRxCtsDcs}" />`;
  cardHTML += `<label for"txFreq${index}">Tx Freq</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="txFreq${index}" name="txFreq" value="${c.txFreq}" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  cardHTML += `<label for"txCtsDcs${index}">Tx QT/DQT</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="txCtsDcs${index}" name="txCtsDcs" value="${c.strTxCtsDcs}" />`;
  cardHTML += `<label for"txpower${index}">Power</label>`;
  cardHTML += `<select class="ch-select" index=${index} id="txpower${index}" name="txpower value ="${c.txPower}"><option value="0">High</option>
    <option value="1">Low</option></select>`;
    cardHTML += `<label for"bandwide${index}">W/N</label>`;
    cardHTML += `<select class="ch-select" index=${index} id="bandwide${index}" name="bandwide" value="${c.bandwide}"><option value="0">Wide</option>
    <option value="1">Narrow</option></select>`;
    cardHTML += `<label for"scanAdd${index}">Scan</label>`;
    cardHTML += `<select class="ch-select" index=${index} id="scanAdd${index}" name="scanAdd" value="${c.scanAdd}"><option value="0">Del</option>
    <option value="1">Add</option></select>`;
    cardHTML += `<label for"sqMode${index}">SQ Mode</label>`;
    cardHTML += `<select class="ch-select" index=${index} id="sqMode${index}" name="sqMode" value = "${c.sqMode}"><option value="0">SQ-DQT</option>
    <option value="1">SQ-DQT*DTMF</option><option value="2">SQ-DQT+DTMF</option></select>`;
    cardHTML += `<label for"pttId${index}">PTT ID</label>`;
    cardHTML += `<select class="ch-select" index=${index} id="pttId${index}" name="pttId" value="${c.pttid}"><option value="0">Off</option>
    <option value="1">BOT</option><option value="2">EOT</option><option value="3">Both</option></select>`;
    cardHTML += `<label for"signalGroup${index}">Signaling</label>`;
    cardHTML += `<input class="ch-select" index=${index} type="number" id="signalGroup${index}" name="signalGroup" min="1" max="20" value="${
    parseInt(c.signalGroup) + 1
  }"/>`;
  cardHTML += `<label for"busyLock${index}">BCL</label>`;
  cardHTML += `<select class="ch-select" index=${index} id="busyLock${index}" name="busyLock" value="${c.busyLock}"><option value="0">OFF</option>
  <option value="1">ON</option></select>`;
  cardHTML += `<label for"fhss${index}">FHSS</label>`;
  cardHTML += `<select class="ch-select" index=${index} id="fhss${index}" name="fhss" value="${c.fhss}"><option value="0">On</option>
    <option value="1">Off</option></select>`;
    cardHTML += `<label for"cname${index}">Name</label>`;
    cardHTML += `<input class="ch-input" index=${index} type="text" id="cname${index}" name="cname" value="${c.cName}" />`;

  let div = document.createElement("div");
  div.innerHTML = cardHTML;
  div.classList.add("channel-card");
  div.id = `card${index}`;
  //div.appendChild(createChannelEditor());

  return div;
}

function chIndexClick(e) {
  if (e.currentTarget.style.backgroundColor == "red") {
    e.currentTarget.style.backgroundColor = "white";
  } else {
    e.currentTarget.style.backgroundColor = "red";
  }
}
export function populateChannelCards(radioProgram, zone) {
  //Clear cards
  clearChannelCards();

  document.getElementById("channel-opt-zonename").value = Main.getRadioProgram().getZone(zone).getName();

  let cards = document.querySelector(".channel-cards");

  for (var i = 0; i < radioProgram.getZone(zone).getChannelCount(); i++) {
    cards.appendChild(createCard(radioProgram.getZone(zone).getChannel(i), i));
  }

  let chBtns = document.getElementsByClassName("ch-index");

  for (var i = 0; i < chBtns.length; i++) {
    chBtns[i].addEventListener("mousedown", chIndexClick);
  }

  let chInputs = document.getElementsByClassName("ch-input");
  for (var i = 0; i < chInputs.length; i++) {
    chInputs[i].addEventListener("input", updateValue);
  }

  let chSelects = document.getElementsByClassName("ch-select");
  for (var i = 0; i < chSelects.length; i++) {
    chSelects[i].addEventListener("change", updateValue);
  }
}

function clearChannelCards() {
  let cards = document.querySelector(".channel-cards");
  cards.innerHTML = "";
}

function optFirstClick() {
  let e = document.getElementById("zone-list");
  e.value = 0;
  populateChannelCards(Main.getRadioProgram(), 0);
}
function optPrevClick() {
  let e = document.getElementById("zone-list");
  let val = parseInt(e.value);
  if (val > 0) {
    e.value = val - 1;
    populateChannelCards(Main.getRadioProgram(), val-1);
  }
}
function optNextClick() {
  let e = document.getElementById("zone-list");
  let val = parseInt(e.value);
  if (val < 9) {
    e.value = val + 1;
    populateChannelCards(Main.getRadioProgram(), val+1);
  }
}
function optLastClick() {
  let e = document.getElementById("zone-list");
  e.value = 9;
  populateChannelCards(Main.getRadioProgram(), 9);
}

function updateValue(e) {
  
  //Only update when input is valid
  let index = parseInt(e.target.getAttribute("index"));
  if (e.target.checkValidity()) {
    saveChannel(index);
  }
}

function updateGV(e) {

  let el = e.target;
  let gv = el.getAttribute('id');
  gv = gv.replace('global-','');

  Main.getRadioProgram().setGlobalValue(gv,el.value)

  
}

function updateZoneName(e){
  let el = e.target;
  let id = el.getAttribute('id');
  id = id.replace('zones-name','')
  let num = parseInt(id)-1;

  Main.getRadioProgram().getZone(num).setName(el.value);
}

function saveChannel(index) {
  
  let zone = parseInt(document.getElementById("zone-list").value);
  let chan = Main.getRadioProgram().getZone(zone).getChannel(index);
  chan.rxFreq = chan.formatFreq(
    document.getElementById(`rxFreq${index}`).value
  );
  chan.strRxCtsDcs = document.getElementById(`rxCtsDcs${index}`).value;
  chan.txFreq = chan.formatFreq(
    document.getElementById(`txFreq${index}`).value
  );
  chan.strTxCtsDcs = document.getElementById(`txCtsDcs${index}`).value;
  chan.txPower = parseInt(document.getElementById(`txpower${index}`).value);
  chan.bandwide = parseInt(document.getElementById(`bandwide${index}`).value);
  chan.scanAdd = parseInt(document.getElementById(`scanAdd${index}`).value);
  chan.sqMode = parseInt(document.getElementById(`sqMode${index}`).value);
  chan.pttid = parseInt(document.getElementById(`pttId${index}`).value);
  chan.busyLock = parseInt(document.getElementById(`busyLock${index}`).value);
  chan.fhss = parseInt(document.getElementById(`fhss${index}`).value);
  chan.cName = document.getElementById(`cname${index}`).value;

  //Main.getRadioProgram().getZone(zone).setChannel(chan, index);
}

let gvSelects = document.getElementsByClassName("gv-select");
  for (var i = 0; i < gvSelects.length; i++) {
    gvSelects[i].addEventListener("change", updateGV);
  }
let zoneNames = document.getElementsByClassName("zone-name");
for(var i =0; i < zoneNames.length; i++){
  zoneNames[i].addEventListener("change",updateZoneName);
}

// buttons
document
  .getElementById("channel-opt-first")
  .addEventListener("click", optFirstClick);
document
  .getElementById("channel-opt-prev")
  .addEventListener("click", optPrevClick);
document
  .getElementById("channel-opt-next")
  .addEventListener("click", optNextClick);
document
  .getElementById("channel-opt-last")
  .addEventListener("click", optLastClick);
