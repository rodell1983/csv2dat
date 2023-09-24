import * as Chirp from "./chirp.js";
import * as UV17Pro from "./uv17pro.js";
import * as IO from "./io.js";
import * as UI from "./ui.js";
import * as Util from "./util.js";

let radioProgram = new UV17Pro.RadioProgram();

export function getRadioProgram() {
  return radioProgram;
}

export function clearRadioProgram() {
  radioProgram = new UV17Pro.RadioProgram();
}

export function loadRPFromChirp(indexes, list) {
  if (!validateChirpCsv(indexes, list)) {
    return false;
  }
  radioProgram.clearZones();

  for (var i = 0; i < list.length - 1; i++) {
    let cc = new Chirp.ChirpChannel(indexes, list[i]);
    let c = new UV17Pro.UV17Channel();
    c.loadFromChirpChannel(cc);
    let zIndex = Math.trunc(i / 100);
    radioProgram.getZone(zIndex).addChannel(c);
  }
  UI.populateChannelCards(radioProgram, 0);
}

function validateChirpCsv(indexes, list) {
  if (indexes == null || list == null) {
    return false;
  } else {
    return true;
  }
}

function zoneChange() {
  var e = document.getElementById("zone-list");
  var index = e.value;

  UI.populateChannelCards(radioProgram, index);
}

function clearPages() {
  let tabPages = document.getElementsByClassName("tab-page");
  let tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabPages.length; i++) {
    tabPages[i].style.display = "none";
  }
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
}

function globalTabClick() {
  let page = document.getElementById("page-global");
  let tab = document.getElementById("tab-global");
  clearPages();
  page.style.display = "grid";
  tab.classList.add("active");
}

function zonesTabClick() {
  let page = document.getElementById("page-zones");
  let tab = document.getElementById("tab-zones");
  clearPages();
  page.style.display = "grid";
  tab.classList.add("active");
}

function channelsTabClick() {
  let page = document.getElementById("page-channels");
  let tab = document.getElementById("tab-channels");
  clearPages();
  page.style.display = "grid";
  tab.classList.add("active");
}
function vfoTabClick() {
  let page = document.getElementById("page-vfo");
  let tab = document.getElementById("tab-vfo");
  clearPages();
  page.style.display = "grid";
  tab.classList.add("active");
}
function dtmfTabClick() {
  let page = document.getElementById("page-dtmf");
  let tab = document.getElementById("tab-dtmf");
  clearPages();
  page.style.display = "grid";
  tab.classList.add("active");
}

function deleteChannels() {
  let zone = parseInt(document.getElementById("zone-list").value);
  let channels = document.getElementsByClassName("ch-index");

  let delCount = 0;

  for (var i = channels.length - 1; i >= 0; i--) {
    if (channels[i].style.backgroundColor === "red") {
      radioProgram.getZone(zone).removeChannel(i);
      delCount++;
    }
  }

  UI.populateChannelCards(radioProgram, zone);

  if (delCount > 0) {
    let c = "";
    if (delCount == 1) {
      c = "Channel";
    } else {
      c = "Channels";
    }
    alert(`${delCount} ${c} Deleted`);
  } else {
    alert("No channels selected");
  }
}

function addChannel() {
  let zone = parseInt(document.getElementById("zone-list").value);
  let rpZone = radioProgram.getZone(zone);
  if (rpZone.getChannelCount() >= rpZone.maxChannels) {
    alert(`No available channel slots for zone ${rpZone.getName()}`);
  } else {
    rpZone.addChannel(new UV17Pro.UV17Channel());
    UI.populateChannelCards(radioProgram, zone);
    var height = document.body.scrollHeight;
    window.scroll(0, height);
  }
}

export function newProgram() {
  let res = confirm(
    "Are you sure you want to create a new program? This will erase all data."
  );
  if (res) {
    clearRadioProgram();
    UI.populateChannelCards(radioProgram, 0);
    storeGlobalVals(radioProgram);
    alert("New program loaded.");
  }
}

export function storeGlobalVals() {
  let values = radioProgram.globalValues;
  localStorage.globalValues = JSON.stringify(values);
}

export function getGlobalVals() {
  return JSON.parse(localStorage.getItem("globalValues"));
}

export function loadGlobalVals() {
  let gvs = getGlobalVals();
  if (gvs == null) {
    gvs = radioProgram.globalValues;
  }

  for (const key in gvs) {
    let e = document.getElementById(`global-${key}`);
    if (e !== null) {
      e.value = gvs[key];
    }
  }
}

export function loadVFOVals(){
  let vfoA = getRadioProgram().vfoA;

  for (const key in vfoA) {
    let e = document.getElementById(`vfoA-${key}`);
    if (e !== null) {
      e.value = vfoA[key];
    }
  }
  let vfoB = getRadioProgram().vfoB;

  for (const key in vfoB) {
    let e = document.getElementById(`vfoB-${key}`);
    if (e !== null) {
      e.value = vfoB[key];
    }
  }

  let vfoOpt = getRadioProgram().vfoOpts;

  for (const key in vfoOpt) {
    let e = document.getElementById(`vfo-opt-${key}`);
    if (e !== null) {
      e.value = vfoOpt[key];
    }
  }
}

export function loadDTMFVals(){
  let dtmfContacts = getRadioProgram().dtmfContacts;
  for(var i = 1; i <= 20; i++){

    let eCode = document.getElementById(`dtmf-contact-code-${i}`);
    let eName = document.getElementById(`dtmf-contact-name-${i}`);
    if(eCode !== null){
      eCode.value = dtmfContacts[i-1]['code'];
    }
    if(eName !== null){
      eName.value = dtmfContacts[i-1]['name'];
    }
  }

  let dtmfGlobal = getRadioProgram().dtmfGlobal;
  for (const key in dtmfGlobal) {
    let e = document.getElementById(`dtmf-global-${key}`);
    if (e !== null) {
      e.value = dtmfGlobal[key];
    }
  }

}

//Add event listeners

document.getElementById("zone-list").addEventListener("change", zoneChange);
document
  .getElementById("channel-opt-del")
  .addEventListener("click", deleteChannels);
document
  .getElementById("channel-opt-add")
  .addEventListener("click", addChannel);
document.getElementById("new-dat-btn").addEventListener("click", newProgram);

//Tab pages
document.getElementById("tab-global").addEventListener("click", globalTabClick);
document.getElementById("tab-zones").addEventListener("click", zonesTabClick);
document
  .getElementById("tab-channels")
  .addEventListener("click", channelsTabClick);
document.getElementById("tab-vfo").addEventListener("click", vfoTabClick);
document.getElementById("tab-dtmf").addEventListener("click", dtmfTabClick);

clearPages();
channelsTabClick();

loadRPFromChirp(Chirp.getcsvIndexes(), Chirp.getcsvList());
loadGlobalVals();
loadVFOVals();
loadDTMFVals();

let gvs = getGlobalVals();
if (gvs != null) {
  radioProgram.globalValues = gvs;
} else {
  storeGlobalVals();
}
