import * as Chirp from "./chirp.js";
import * as UV17Pro from "./uv17pro.js";
import * as IO from "./io.js";
import * as UI from "./ui.js";
import * as Util from "./util.js";

let radioProgram = new UV17Pro.RadioProgram();

export function loadRPFromChirp(indexes, list) {

  radioProgram.clearZones();

  for (var i = 0; i < list.length; i++) {
    let cc = new Chirp.ChirpChannel(indexes, list[i]);
    let c = new UV17Pro.UV17Channel();
    c.loadFromChirpChannel(cc);
    let zIndex = Math.trunc(i/100);
    radioProgram.getZone(zIndex).addChannel(c);
  }
  UI.populateChannelCards(radioProgram);
}

function zoneChange(){
  var e = document.getElementById("zone-list");
  var index = e.value;

  UI.populateChannelCards(radioProgram,index);

}

function zonesTabClick(){
  let page = document.getElementById("page-zones");
  let tab = document.getElementById("tab-zones");
  clearPage();
  page.style.display = "grid";
  tab.classList.add("active")
}

function channelsTabClick(){
  let page = document.getElementById("page-channels");
  let tab = document.getElementById("tab-channels");
  clearPage();
  page.style.display = "grid";
  tab.classList.add("active")
}

function clearPage(){
  let tabPages = document.getElementsByClassName("tab-page");
  let tabs = document.getElementsByClassName("tab");
  for(var i=0; i < tabPages.length; i++){
    tabPages[i].style.display= "none";
  }
  for(var i=0; i < tabs.length; i++){
    tabs[i].classList.remove("active")
  }
}

document
  .querySelector("#zone-list")
  .addEventListener("change", zoneChange);

document.getElementById("tab-zones").addEventListener("click", zonesTabClick);
document.getElementById("tab-channels").addEventListener("click", channelsTabClick);

loadRPFromChirp(Chirp.getcsvIndexes(), Chirp.getcsvList());


