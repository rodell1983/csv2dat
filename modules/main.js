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

export function loadRPFromChirp(
  indexes,
  list,
  zone = 0,
  importStyle = 0,
  overflow = true,
  clear = true
) {
  let channelIndex = 0;

  if (!validateChirpCsv(indexes, list)) {
    return false;
  }

  if (clear) {
    radioProgram.clearZones();
  }

  let overwrite = false;
  if (importStyle == 0) {
    overwrite = true;
  }
  //Overwrite
  while (zone < 10) {
    for (i = 0; i < 100; i++) {
      if (channelIndex < list.length) {
        let cc = new Chirp.ChirpChannel(indexes, list[channelIndex]);
        let c = new UV17Pro.UV17Channel();
        c.loadFromChirpChannel(cc);
        //write channel only if empty or overwrite
        if (i < radioProgram.getZone(zone).getChannelCount()) {
          if (overwrite || radioProgram.getZone(zone).getChannel(i).isEmpty()) {
            radioProgram.getZone(zone).setChannel(c, i);
            channelIndex++;
          }
        } else {
          radioProgram.getZone(zone).addChannel(c);
          channelIndex++;
        }
      } else {
        break;
      }
    }
    if (overflow) {
      zone++;
    } else {
      //exit loop
      zone = 10;
    }
  }

  if (channelIndex < list.length) {
    alert(`${list.length - channelIndex} Channels not loaded.`);
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
  UI.populateChannelCards(
    radioProgram,
    document.getElementById("zone-list").value
  );
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

function deleteChannels(showAlert = true) {
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
    if (showAlert) {
      alert(`${delCount} ${c} Deleted`);
    }
  } else {
    if (alert) {
      alert("No channels selected");
    }
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

export async function newProgram() {
  /*
  const port = await navigator.serial.requestPort();

// Wait for the serial port to open.
await port.open({ baudRate: 9600 });

while (port.readable) {

  const writer = port.writable.getWriter();

  const s = 'PROGRAMCOLORPROU';

  const utf8EncodeText = new TextEncoder();

let data = new Uint8Array(16);
data = utf8EncodeText.encode(s);

alert(data);

await writer.write(data);


// Allow the serial port to be closed later.
writer.releaseLock();
  const reader = port.readable.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      if (value) {
        console.log(value);
      }
    }
  } catch (error) {
    // TODO: Handle non-fatal read error.
  }
}
*/
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
  localStorage.globalValues = JSON.stringify(radioProgram);
}

export function getGlobalVals() {
  return JSON.parse(localStorage.getItem("globalValues"));
}

export function loadGlobalVals() {
  let gvs = getGlobalVals().globalValues;
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

export function loadVFOVals() {
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

export function loadDTMFVals() {
  let dtmfContacts = getRadioProgram().dtmfContacts;
  for (var i = 1; i <= 20; i++) {
    let eCode = document.getElementById(`dtmf-contact-code-${i}`);
    let eName = document.getElementById(`dtmf-contact-name-${i}`);
    if (eCode !== null) {
      eCode.value = dtmfContacts[i - 1]["code"];
    }
    if (eName !== null) {
      eName.value = dtmfContacts[i - 1]["name"];
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

export function loadZoneNames() {
  for (var i = 0; i < radioProgram.maxZones; i++) {
    let el = document.getElementById(`zones-name${i + 1}`);
    el.value = radioProgram.getZone(i).getName();
  }
}

function moveZonesToggle() {
  const cb = document.getElementById("channel-opt-move-zonemove");
  const zl = document.getElementById("channel-opt-move-zones");

  zl.disabled = !cb.checked;
}

function channelMoveClick() {
  let chanList = [];
  let chanListIndexs = [];
  let zone = parseInt(document.getElementById("zone-list").value);
  let orgZone = zone;
  let channels = document.getElementsByClassName("ch-index");
  let selected = false;

  for (var i = channels.length - 1; i >= 0; i--) {
    if (channels[i].style.backgroundColor === "red") {
      channels[i].style.backgroundColor === "white";
      chanList.push(radioProgram.getZone(zone).getChannel(i));
      chanListIndexs.push(i);
      selected = true;
      //radioProgram.getZone(zone).removeChannel(i);
    }
  }

  if (!selected) {
    alert("No channels selected");
    return;
  }

  const dir = document.getElementById("channel-opt-move-dir");
  if (document.getElementById("channel-opt-move-zonemove").checked) {
    const selectedZone =
      parseInt(document.getElementById("channel-opt-move-zones").value) - 1;
    if (selectedZone < 1 || selectedZone > 10) {
      alert("Zone must be between 1-9");
      document.getElementById("channel-opt-move-zones").value = zone + 1;
      return;
    } else {
      zone = selectedZone;
    }
  }
  let rpDelZone = radioProgram.getZone(orgZone);
  let rpNewZone = radioProgram.getZone(zone);
  switch (dir.value) {
    case "top":
      for (var i = 0; i < chanListIndexs.length; i++) {
        rpDelZone.removeChannel(chanListIndexs[i]);
      }
      for (var i = chanList.length - 1; i >= 0; i--) {
        radioProgram.getZone(zone).insertChannel(chanList[i], 0);
      }
      break;
    case "up":
      for (var i = chanList.length - 1; i >= 0; i--) {
        rpDelZone.removeChannel(chanListIndexs[i]);
        rpNewZone.insertChannel(chanList[i], chanListIndexs[i] - 1);
      }
      break;
    case "down":
      for (var i = chanList.length - 1; i >= 0; i--) {
        //rp.removeChannel(chanListIndexs[i]);
        rpNewZone.insertChannel(chanList[i], chanListIndexs[i] + 1);
      }
      break;
    case "bottom":
      for (var i = 0; i < chanListIndexs.length; i++) {
        rpDelZone.removeChannel(chanListIndexs[i]);
      }
      for (var i = 0; i < chanList.length; i++) {
        radioProgram.getZone(zone).addChannel(chanList[i]);
      }
      break;
  }

  storeGlobalVals();
  UI.populateChannelCards(radioProgram, zone);
}

function clearChannelsClick() {
  const res = confirm(
    "Are you sure you want to remove all channels from this zone?"
  );

  if (res) {
    let zone = parseInt(document.getElementById("zone-list").value);
    radioProgram.getZone(zone).clearChannels();
    UI.populateChannelCards(radioProgram, zone);
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
document
  .getElementById("channel-opt-move-zonemove")
  .addEventListener("click", moveZonesToggle);
document
  .getElementById("channel-opt-move")
  .addEventListener("click", channelMoveClick);
document
  .getElementById("channel-opt-clear")
  .addEventListener("click", clearChannelsClick);

clearPages();
let rp = getGlobalVals();
if (rp != null) {
  radioProgram.globalValues = rp.globalValues;
  radioProgram.vfoA = rp.vfoA;
  radioProgram.vfoB = rp.vfoB;
  radioProgram.vfoOpts = rp.vfoOpt;
  for (var i = 0; i < radioProgram.maxZones; i++) {
    radioProgram.getZone(i).setName(rp.zones[i].name);
  }
  radioProgram.dtmfGlobal = rp.dtmfGlobal;
  radioProgram.dtmfContacts = rp.dtmfContacts;

  for (var z = 0; z < radioProgram.maxZones; z++) {
    for (var c = 0; c < rp.zones[z].channels.length; c++) {
      let jsonChan = rp.zones[z].channels[c];
      let chan = new UV17Pro.UV17Channel();
      chan.loadFromJSONChannel(jsonChan);
      //console.log(chan);
      radioProgram.getZone(z).addChannel(chan);
      //console.log(radioProgram.getZone(z).getChannel(c));
    }
  }

  //UI.populateChannelCards(radioProgram,0);
} else {
  storeGlobalVals();
}

channelsTabClick();

//loadRPFromChirp(Chirp.getcsvIndexes(), Chirp.getcsvList());
loadGlobalVals();
loadZoneNames();
loadVFOVals();
loadDTMFVals();
