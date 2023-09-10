import * as Chirp from "./chirp.js";
import * as UV17Pro from "./uv17pro.js";

function createCard(c,index) {
  let cardHTML = `<span id="ch-index${index}" class="ch-index">${index + 1}</span>`;
  cardHTML += `<input type="text" id="rxFreq${index}" name="rxFreq" value="${c.rxFreq}" />`;
  cardHTML += `<input type="text" id="rxCtsDcs${index}" name="rxCtsDcs" value="${c.strRxCtsDcs}" />`;
  cardHTML += `<input type="text" id="txFreq${index}" name="txFreq" value="${c.txFreq}" />`;
  cardHTML += `<input type="text" id="txCtsDcs${index}" name="txCtsDcs" value="${c.strTxCtsDcs}" />`;
  cardHTML += `<select id="txpower${index}" name="txpower value ="${c.txPower}"><option value="0">High</option>
    <option value="1">Low</option></select>`;
  cardHTML += `<select id="bandwide${index}" name="bandwide" value="${c.bandwide}"><option value="0">Wide</option>
    <option value="1">Narrow</option></select>`;
  cardHTML += `<select id="scanAdd${index}" name="scanAdd" value="${c.scanAdd}"><option value="0">Del</option>
    <option value="1">Add</option></select>`;
  cardHTML += `<select id="sqMode${index}" name="sqMode" value = "${c.sqMode}"><option value="0">SQ-DQT</option>
    <option value="1">SQ-DQT*DTMF</option><option value="2">SQ-DQT+DTMF</option></select>`;
  cardHTML += `<select id="pttId${index}" name="pttId" value="${c.pttid}"><option value="0">Off</option>
    <option value="1">BOT</option><option value="2">EOT</option><option value="3">Both</option></select>`;
  cardHTML += `<input type="number" id="signalGroup${index}" name="signalGroup" min="1" max="20" value="${c.signalGroup}"/>`;
  cardHTML += `<select id="busyLock${index}" name="busyLock" value="${c.busyLock}"><option value="0">OFF</option>
  <option value="1">ON</option></select>`;
  cardHTML += `<select id="fhss${index}" name="fhss" value="${c.fhss}"><option value="0">On</option>
    <option value="1">Off</option></select>`;
  cardHTML += `<input type="text" id="cname${index}" name="cname" value="${c.cName}" />`;

  let div = document.createElement("div");
  div.innerHTML = cardHTML;
  div.classList.add("channel_card");
  div.id = `card${index}`;
  //div.appendChild(createChannelEditor());

  return div;
}

function createChannelEditor(){
  let editorHTML = `<button id="delete-chan">Delete</button><button id="clear-chan">Clear</button>`;
  let div = document.createElement('div');
  div.innerHTML = editorHTML;
  return div;
}

export function populateChannelCards(radioProgram,zone = 0) {
  //Clear cards
  clearChannelCards();

  let cards = document.querySelector(".channel_cards");

  for (var i = 0; i < radioProgram.getZone(zone).getChannelCount(); i++) {
    cards.appendChild(createCard(radioProgram.getZone(zone).getChannel(i),i));
  }
}

function clearChannelCards(){
  let cards = document.querySelector(".channel_cards");
  cards.innerHTML ="";
}


