import * as Chirp from "./chirp.js";
import * as UV17Pro from "./uv17pro.js";
import * as Main from "./main.js";

function clearPopup() {
  document.getElementById("popup").style.display = "none";
  //document.getElementById("popup-title").innerHTML = "";

  let body = document.getElementById("popup-body");
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}
function showPopup(title, body) {
  document.getElementById("popup-title").innerHTML = title;
  document.getElementById("popup-body").appendChild(body);

  document.getElementById("popup").style.display = "grid";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
}

export function loadImportPopup(title) {

  clearPopup();

  let body = document.createElement("div");
  body.innerHTML = `<fieldset class="import-popup-opts" >

              <label for="import-zone-list">Beginning Zone</label>
              <select name="import-zone-list" id="import-zone-list">
                <option value="0">Zone 1</option>
                <option value="1">Zone 2</option>
                <option value="2">Zone 3</option>
                <option value="3">Zone 4</option>
                <option value="4">Zone 5</option>
                <option value="5">Zone 6</option>
                <option value="6">Zone 7</option>
                <option value="7">Zone 8</option>
                <option value="8">Zone 9</option>
                <option value="9">Zone 10</option>
              </select>

              <fieldset>
                <legend>Import Style</legend>
                <input
                  type="radio"
                  name="import-opt-style"
                  id="import-opt-overwrite"
                  value="overwrite"
                  title="Overwrite all channels beginning at selected zone"
                  checked
                />
                <label for="import-opt-overwrite">Overwrite</label>
                <input
                  type="radio"
                  name="import-opt-style"
                  id="import-opt-append"
                  value="append"
                  title="Only write to empty channels"
                />
                <label for="import-opt-append">Append</label>
              </fieldset>
              <div class="flex-cont">
                <input
                  type="checkbox"
                  id="import-opt-overflow"
                  name="import-opt-overflow"
                  title="Allow additional channels to load into the next zone(s)"
                  checked
                />
                <label for="import-opt-overflow">Allow Zone Overflow</label>
                <input
                  type="checkbox"
                  id="import-opt-clearall"
                  name="import-opt-clearall"
                  title="Clear All zones prior to import"
                  checked
                />
                <label for="import-opt-clearall">Clear All Zones</label>
                </div>
                <div class="flex-cont">
                  <button id="popup-import-btn">Import</button
                  ><button id="popup-cancel-btn">Cancel</button>
                </div>
              </div>
              </fieldset>`;
  showPopup(title, body);

  document.getElementById("import-zone-list").value =
    document.getElementById("zone-list").value;
  //Load events
  document
    .getElementById("popup-import-btn")
    .addEventListener("click", popupImportClick);

  document
    .getElementById("popup-cancel-btn")
    .addEventListener("click", hidePopup);
}

//Pop Up
function popupImportClick() {
  const zone = document.getElementById("import-zone-list").value;
  let importStyle = 0;
  if (document.getElementById("import-opt-overwrite").checked) {
    importStyle = 0;
  } else {
    importStyle = 1;
  }
  const overflow = document.getElementById("import-opt-overflow").checked;
  const clear = document.getElementById("import-opt-clearall").checked;

  Main.loadRPFromChirp(
    Chirp.getcsvIndexes(),
    Chirp.getcsvList(),
    zone,
    importStyle,
    overflow,
    clear
  );
  hidePopup();
}

function createDTMFContacts() {
  let dtmf = "";
  for (var i = 1; i <= 20; i++) {
    dtmf += `<fieldset>
    <legend>#${i}</legend>
    <label for="dtmf-contact-code-${i}">Code</label>
    <input class="dtmf-contact-input" type="input" index="${i}" name="dtmf-contact-code-${i}" id="dtmf-contact-code-${i}" />
    <label for="dtmf-contact-name-${i}">Name</label>
    <input class="dtmf-contact-input" type="input" index="${i}" name="dtmf-contact-name-${i}" id="dtmf-contact-name-${i}" />
    </fieldset>`;
  }

  return dtmf;
}

function createDTMFGlobal() {
  /*
<label for="dtmf-global-group">Group</label>
    <input class="dtmf-global-input" type="input" name="dtmf-global-group" id="dtmf-global-group" />
    <label for="dtmf-global-groupname">Group Name</label>
    <input class="dtmf-global-input" type="input" name="dtmf-global-groupname" id="dtmf-global-groupname" />
  */
  let dtmf = `<fieldset>
    <legend>DTMF Settings</legend>
    <label for="dtmf-global-localid">Local ID</label>
    <input class="dtmf-global-input" type="input" name="dtmf-global-localid" id="dtmf-global-localid" />
    
    <label for="dtmf-global-wordtime">DTMF Code Time</label>
    <select class="dtmf-global-input" id="dtmf-global-wordtime" name="dtmf-global-wordtime">
    <option value ="0">50ms</option>
    <option value ="1">100ms</option>
    <option value ="2">200ms</option>
    <option value ="3">300ms</option>
    <option value ="4">500ms</option>
    </select>

    <label for="dtmf-global-idletime">DTMP Idle Time</label>
    <select class="dtmf-global-input" id="dtmf-global-idletime" name="dtmf-global-idletime">
    <option value ="0">50ms</option>
    <option value ="1">100ms</option>
    <option value ="2">200ms</option>
    <option value ="3">300ms</option>
    <option value ="4">500ms</option>
    </select>

    <label for="dtmf-global-hanguptime">Hang-up Time</label>
    <select class="dtmf-global-input" id="dtmf-global-hanguptime" name="dtmf-global-hanguptime">
    <option value ="0">3s</option>
    <option value ="1">4s</option>
    <option value ="2">5s</option>
    <option value ="3">6s</option>
    <option value ="4">7s</option>
    <option value ="5">8s</option>
    <option value ="6">9s</option>
    <option value ="7">10s</option>
    </select>
    </fieldset>`;

  return dtmf;
}

function populateDTMF() {
  let DTMFContacts = document.getElementById("dtmf-contacts");
  DTMFContacts.innerHTML = createDTMFContacts();

  let DTMFGlobal = document.getElementById("dtmf-global");
  DTMFGlobal.innerHTML = createDTMFGlobal();
}

function createVFO(letter) {
  let vfo = `<label for"vfo${letter}-rxfreq">Frequency</label>`;
  vfo += `<input class="vfo-input" type="text" id="vfo${letter}-rxfreq" name="vfo${letter}-rxfreq" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  vfo += `<label for"vfo${letter}-rxqt">Rx QT/DQT</label>`;
  vfo += `<input class="vfo-input" type="text" id="vfo${letter}-rxqt" name="vfo${letter}-rxqt" maxlength="5" minlength="2" pattern="[0-9]{2,3}|[0-9]{2,3}[.]{0,1}[0-9]{1,1}|[Dd]{1}[0-9]{3}[INin]{1}" />`;
  vfo += `<label for"vfo${letter}-txqt">Tx QT/DQT</label>`;
  vfo += `<input class="vfo-input" type="text" id="vfo${letter}-txqt" name="vfo${letter}-txqt" maxlength="5" minlength="2" pattern="[0-9]{2,3}|[0-9]{2,3}[.]{0,1}[0-9]{1,1}|[Dd]{1}[0-9]{3}[INin]{1}" />`;
  vfo += `<label for"vfo${letter}-sqmode">SQ Mode</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-sqmode" name="vfo${letter}-sqmode"><option value="0">SQ-DQT</option>
  <option value="1">SQ-DQT*DTMF</option><option value="2">SQ-DQT+DTMF</option></select>`;
  vfo += `<label for"vfo${letter}-power">Power</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-power" name="vfo${letter}-power" ><option value="0">High</option>
    <option value="1">Low</option></select>`;
  vfo += `<label for"vfo${letter}-bandwide">W/N</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-bandwide" name="vfo${letter}-bandwide"><option value="0">Wide</option>
    <option value="1">Narrow</option></select>`;
  vfo += `<label for"vfo${letter}-step">Step</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-step" name="vfo${letter}-step"><option value="0">2.5KHz</option>
    <option value="1">5.0KHz</option><option value="2">6.25KHz</option><option value="3">10.0KHz</option><option value="4">12.5KHz</option>
    <option value="5">20.0KHz</option><option value="6">25.0KHz</option><option value="7">50.0KHz</option></select>`;
  vfo += `<label for"vfo${letter}-signalling">Signalling</label>`;
  vfo += `<input class="vfo-input" type="number" id="vfo${letter}-signalling" name="vfo${letter}-signalling" min="1" max="20"/>`;
  vfo += `<label for"vfo${letter}-offsetdir">Offset</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-offsetdir" name="vfo${letter}-offsetdir"><option value="0">OFF</option>
    <option value="1">+</option><option value="2">-</option></select>`;
  vfo += `<label for"vfo${letter}-offset">Offset Freq</label>`;
  vfo += `<input class="vfo-input" type="text" id="vfo${letter}-offset" name="vfo${letter}-offset" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  vfo += `<label for"vfo${letter}-fhss">FHSS</label>`;
  vfo += `<select class="vfo-select" id="vfo${letter}-fhss" name="vfo${letter}-fhss"><option value="0">On</option>
    <option value="1">Off</option></select>`;
  return vfo;
}

function createVFOopts() {
  let vfo = `<fieldset><label for"vfoScanRange">VFO Scan Range</label>`;
  vfo += `<input class="vfo-opt-input" type="number" id="vfo-opt-scanlow" name="vfo-opt-scanlow" min="107" max="480"/>`;
  vfo += `<input class="vfo-opt-input" type="number" id="vfo-opt-scanhigh" name="vfo-opt-scanhigh" min="107" max="480"/></fieldset>`;
  vfo += `<fieldset><label for"vfo-opt-bcl">BCL</label>`;
  vfo += `<select class="vfo-opt-input" id="vfo-opt-bcl" name="vfo-opt-bcl"><option value="0">OFF</option>
  <option value="1">ON</option></select>`;
  vfo += `<label for"vfo-opt-pttId">PTT ID</label>`;
  vfo += `<select class="vfo-opt-input" id="vfo-opt-pttId" name="vfo-opt-pttId"><option value="0">Off</option></fieldset>`;

  return vfo;
}

function populateVFOs() {
  let vfoA = document.getElementById("vfoA");
  vfoA.innerHTML = createVFO("A");
  let vfoB = document.getElementById("vfoB");
  vfoB.innerHTML = createVFO("B");
  let vfoOpts = document.getElementById("vfoOpts");
  vfoOpts.innerHTML = createVFOopts();
}

function createCard(c, index) {
  let cardHTML = `<span id="ch-index${index}" class="ch-index" title="Click to Select">${
    index + 1
  }</span>`;
  cardHTML += `<label for"rxFreq${index}">Rx Freq</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="rxFreq${index}" name="rxFreq" value="${c.rxFreq}" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  cardHTML += `<label for"rxCtsDcs${index}">Rx QT/DQT</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="rxCtsDcs${index}" name="rxCtsDcs" value="${c.strRxCtsDcs}" maxlength="5" minlength="2" pattern="[0-9]{2,3}|[0-9]{2,3}[.]{0,1}[0-9]{1,1}|[Dd]{1}[0-9]{3}[INin]{1}" />`;
  cardHTML += `<label for"txFreq${index}">Tx Freq</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="txFreq${index}" name="txFreq" value="${c.txFreq}" maxlength="9" minlength="3" pattern="[0-9]{3}[.]{0,1}[0-9]{0,5}"/>`;
  cardHTML += `<label for"txCtsDcs${index}">Tx QT/DQT</label>`;
  cardHTML += `<input class="ch-input" type="text" index=${index} id="txCtsDcs${index}" name="txCtsDcs" value="${c.strTxCtsDcs}" maxlength="5" minlength="2" pattern="[0-9]{2,3}|[0-9]{2,3}[.]{0,1}[0-9]{1,1}|[Dd]{1}[0-9]{3}[INin]{1}" />`;

  cardHTML += `<label for"txpower${index}">Power</label>`;
  cardHTML += `<select class="ch-select" index=${index} id="txpower${index}" name="txpower" value ="${c.txPower}"><option value="0">High</option>
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

  //Set default
  for (const child of div.children) {
    switch (child.id) {
      case `txpower${index}`:
        child.selectedIndex = c.txPower;
        break;
      case `bandwide${index}`:
        child.selectedIndex = c.bandwide;
        break;
      case `scanAdd${index}`:
        child.selectedIndex = c.scanAdd;
        break;
      case `sqMode${index}`:
        child.selectedIndex = c.sqMode;
        break;
      case `pttId${index}`:
        child.selectedIndex = c.pttid;
        break;
      case `busyLock${index}`:
        child.selectedIndex = c.busyLock;
        break;
      case `fhss${index}`:
        child.selectedIndex = c.fhss;
        break;
      case `signalGroup${index}`:
        child.value = c.signalGroup + 1;
      default:
        break;
    }
  }

  return div;
}

function chIndexClick(e) {
  //alert(e.target.textContent);
  let index = parseInt(e.target.textContent) - 1;
  let card = document.getElementById(`card${index}`);

  if (e.currentTarget.style.backgroundColor == "red") {
    for (const child of card.children) {
      //odd
      if (index & (1 == 1)) {
        child.style.backgroundColor = "lightgrey";
      } else {
        child.style.backgroundColor = "white";
      }
    }
    e.currentTarget.style.backgroundColor = "lightgrey";
  } else {
    for (const child of card.children) {
      //odd
      if (index & (1 == 1)) {
        child.style.backgroundColor = "#fffec8";
      } else {
        child.style.backgroundColor = "#fffedd";
      }
    }
    e.currentTarget.style.backgroundColor = "red";
  }
}
export function populateChannelCards(radioProgram, zone) {
  //Clear cards
  clearChannelCards();

  document.getElementById("channel-opt-zonename").value = Main.getRadioProgram()
    .getZone(zone)
    .getName();

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

  document.getElementById("zone-list").selectedIndex = zone;
  Main.storeGlobalVals();
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
    populateChannelCards(Main.getRadioProgram(), val - 1);
  }
}
function optNextClick() {
  let e = document.getElementById("zone-list");
  let val = parseInt(e.value);
  if (val < 9) {
    e.value = val + 1;
    populateChannelCards(Main.getRadioProgram(), val + 1);
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
  //if (e.target.checkValidity()) {
  saveChannel(index);
  //}
}

function updateGV(e) {
  let el = e.target;
  let gv = el.getAttribute("id");
  gv = gv.replace("global-", "");

  Main.getRadioProgram().setGlobalValue(gv, el.value);
  Main.storeGlobalVals();
}

function updateZoneName(e) {
  let el = e.target;
  let id = el.getAttribute("id");
  let num = 1;
  if (id == "channel-opt-zonename") {
    num = parseInt(document.getElementById("zone-list").value);
  } else {
    id = id.replace("zones-name", "");
    num = parseInt(id) - 1;
  }

  Main.getRadioProgram().getZone(num).setName(el.value);
  Main.loadZoneNames();
  Main.storeGlobalVals();
}

//vfo
function updateVFO(e) {
  let el = e.target;
  let id = el.getAttribute("id");
  let aorb = id.slice(3)[0];

  id = id.slice(4);

  let vfo;
  if (aorb == "A") {
    vfo = Main.getRadioProgram().vfoA;
    vfo[id] = el.value;
    Main.getRadioProgram().vfoA = vfo;
  } else {
    vfo = Main.getRadioProgram().vfoB;
    vfo[id] = el.value;
    Main.getRadioProgram().vfoB = vfo;
  }

  Main.storeGlobalVals();
}

function updateVFOopt(e) {
  let el = e.target;
  let id = el.getAttribute("id");

  id = id.replace("vfo-opt-", "");
  let vfo = Main.getRadioProgram().vfoOpts;

  vfo[id] = el.value;
  Main.getRadioProgram().vfoOpts = vfo;
  Main.storeGlobalVals();
}

//dtmf
function updateDTMFContact(e) {
  let el = e.target;
  let id = el.getAttribute("id");
  let index = parseInt(el.getAttribute("index"));

  id = id.replace("dtmf-contact-", "");
  let key = id.slice(0, 4);

  let contact = Main.getRadioProgram().dtmfContacts[index - 1];

  contact[key] = el.value;
  Main.getRadioProgram().dtmfContacts[index - 1] = contact;
  Main.storeGlobalVals();
}

function updateDTMFGlobal(e) {
  let el = e.target;
  let id = el.getAttribute("id");

  id = id.replace("dtmf-global-", "");
  let dtmf = Main.getRadioProgram().dtmfGlobal;

  dtmf[id] = el.value;
  Main.getRadioProgram().dtmfGlobal = dtmf;
  Main.storeGlobalVals();
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
  chan.signalGroup =
    parseInt(document.getElementById(`signalGroup${index}`).value) - 1;
  chan.fhss = parseInt(document.getElementById(`fhss${index}`).value);
  chan.cName = document.getElementById(`cname${index}`).value;

  Main.getRadioProgram().zones[zone].setChannel(chan, index);

  Main.storeGlobalVals();
}

populateVFOs();
populateDTMF();

let gvSelects = document.getElementsByClassName("gv-select");
for (var i = 0; i < gvSelects.length; i++) {
  gvSelects[i].addEventListener("change", updateGV);
}
let zoneNames = document.getElementsByClassName("zone-name");
for (var i = 0; i < zoneNames.length; i++) {
  zoneNames[i].addEventListener("change", updateZoneName);
}

let vfoSelects = document.getElementsByClassName("vfo-select");
for (var i = 0; i < vfoSelects.length; i++) {
  vfoSelects[i].addEventListener("change", updateVFO);
}
let vfoInputs = document.getElementsByClassName("vfo-input");
for (var i = 0; i < vfoInputs.length; i++) {
  vfoInputs[i].addEventListener("change", updateVFO);
}
let vfoOpts = document.getElementsByClassName("vfo-opt-input");
for (var i = 0; i < vfoOpts.length; i++) {
  vfoOpts[i].addEventListener("change", updateVFOopt);
}
let dtmfContacts = document.getElementsByClassName("dtmf-contact-input");
for (var i = 0; i < dtmfContacts.length; i++) {
  dtmfContacts[i].addEventListener("change", updateDTMFContact);
}
let dtmfGlobals = document.getElementsByClassName("dtmf-global-input");
for (var i = 0; i < dtmfGlobals.length; i++) {
  dtmfGlobals[i].addEventListener("change", updateDTMFGlobal);
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
document.getElementById("popup-close-btn").addEventListener("click", hidePopup);
