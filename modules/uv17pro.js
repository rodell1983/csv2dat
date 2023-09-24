export class UV17Buffer {
  buffer;
  index = 0;
  strIndex = 0;
  freqIndex = new Uint16Array(1);
  qtIndex = new Uint16Array(1);

  constructor(buffer, index, strIndex) {
    this.buffer = buffer;
    this.index = index;
    this.strIndex = strIndex;
  }
  getBuffer() {
    return this.buffer;
  }
  setBuffer(buffer) {
    this.buffer = buffer;
  }

  getIndex() {
    return this.index;
  }
  setIndex(index) {
    this.index = index;
  }

  getStrIndex() {
    return this.strIndex;
  }
  setStrIndex(index) {
    this.strIndex = index;
  }

  getQtIndex() {
    return this.strIndex;
  }
  setQtIndex(index) {
    this.qtIndex = index;
  }

  getFreqIndex() {
    return this.strIndex;
  }
  setFreqIndex(index) {
    this.freqIndex = index;
  }

  seed(buffer) {
    this.index = buffer.getIndex();
    this.strIndex = buffer.getStrIndex();
  }
}
export class UV17Channel {
  id = 0;
  rxFreq = "";
  strRxCtsDcs = "";
  txFreq = "";
  strTxCtsDcs = "";
  busyLock = 0;
  txPower = 0;
  bandwide = 0;
  scanAdd = 0;
  sqMode = 0;
  pttid = 0;
  signalGroup = 0;
  fhss = 0;
  cName = "";

  chanIndex = 185;
  strIndex = 1738;
  freqIndex = new Uint16Array(1);
  qtIndex = new Uint16Array(1);

  constructor(chanIndex = 0, strIndex = 0, freqIndex = 1186, qtIndex = 175) {
    this.chanIndex = chanIndex;
    this.strIndex = strIndex;
    this.freqIndex = freqIndex;
    this.qtIndex = qtIndex;
  }

  getQtIndex() {
    return this.strIndex;
  }
  setQtIndex(index) {
    this.qtIndex = index;
  }

  getFreqIndex() {
    return this.strIndex;
  }
  setFreqIndex(index) {
    this.freqIndex = index;
  }

  loadFromChirpChannel(ChirpChannel) {
    this.id = ChirpChannel.location;
    this.rxFreq = this.formatFreq(ChirpChannel.Frequency);

    // Calculate tx
    let duplex = ChirpChannel.Duplex;
    let offset = ChirpChannel.Offset;

    //Defaults to split
    this.txFreq = this.rxFreq;

    if (Number(offset) != 0) {
      switch (duplex) {
        case "-":
          this.txFreq = parseFloat(this.rxFreq) - parseFloat(offset);
          break;
        case "+":
          this.txFreq = parseFloat(this.rxFreq) + parseFloat(offset);
        //case "":
        //this.txFreq = "";
        //break;
      }
    }

    //Format tx
    this.txFreq = this.formatFreq(this.txFreq);

    // Calculate QT/DQT
    let rxDigital = false;
    let txDigital = false;

    switch (String(ChirpChannel.Tone).toLowerCase()) {
      case "tone":
        this.strTxCtsDcs = ChirpChannel.rToneFreq;
        break;
      case "tsql":
        this.strTxCtsDcs = ChirpChannel.cToneFreq;
        this.strRxCtsDcs = ChirpChannel.cToneFreq;
        break;
      case "dtcs":
        this.strTxCtsDcs = ChirpChannel.DtcsCode;
        this.strRxCtsDcs = ChirpChannel.DtcsCode;
        rxDigital = true;
        txDigital = true;
        break;
      case "dtcs-r":
        this.strRxCtsDcs = ChirpChannel.rxDTCStone;
        rxDigital = true;
        break;
      case "tsql-r":
        this.strRxCtsDcs = ChirpChannel.cToneFreq;
        break;
      case "cross":
        switch (String(ChirpChannel.CrossMode).toLowerCase()) {
          case "tone->tone":
            this.strTxCtsDcs = ChirpChannel.rToneFreq;
            this.strRxCtsDcs = ChirpChannel.cToneFreq;
            break;
          case "tone->dtcs":
            this.strTxCtsDcs = ChirpChannel.rToneFreq;
            this.strRxCtsDcs = ChirpChannel.rxDTCStone;
            rxDigital = true;

            break;
          case "dtcs->tone":
            this.strTxCtsDcs = ChirpChannel.DtcsCode;
            this.strRxCtsDcs = ChirpChannel.cToneFreq;
            txDigital = true;
            break;
          case "->tone":
            this.strRxCtsDcs = ChirpChannel.cToneFreq;
            break;
          case "->dtcs":
            this.strRxCtsDcs = ChirpChannel.rxDTCStone;
            rxDigital = true;
            break;
          case "dtcs->":
            this.strTxCtsDcs = ChirpChannel.DtcsCode;
            txDigital = true;
            break;
          case "dtcs->dtcs":
            this.strTxCtsDcs = ChirpChannel.DtcsCode;
            this.strRxCtsDcs = ChirpChannel.rxDTCStone;
            rxDigital = true;
            txDigital = true;
            break;
          default:
            break;
        }
        break;

      default:
        this.strRxCtsDcs = "";
        this.strTxCtsDcs = "";
        break;
    }

    //format digital
    if (ChirpChannel.DtcsPolarity != "") {
      if (txDigital) {
        if (ChirpChannel.DtcsPolarity.charAt(0).toLowerCase() == "n") {
          this.strTxCtsDcs = "D" + this.strTxCtsDcs + "N";
        } else {
          this.strTxCtsDcs = "D" + this.strTxCtsDcs + "I";
        }
      }
      if (rxDigital) {
        if (ChirpChannel.DtcsPolarity.charAt(0).toLowerCase() == "n") {
          this.strRxCtsDcs = "D" + this.strRxCtsDcs + "N";
        } else {
          this.strRxCtsDcs = "D" + this.strRxCtsDcs + "I";
        }
      }
    }

    this.cName = ChirpChannel.Name;

    if (ChirpChannel.Mode == "NFM") {
      this.bandwide = 1;
    }

    if (ChirpChannel.Skip == "S") {
      this.scanAdd = 1;
    }
  }

  getChannelBuffer() {
    let id_AB = this.createID(); //new ArrayBuffer(13); //  Id – 2E 00 00 00 00 00 00 00 06 94 08 00 00 (increments by 5 – example 94 08 to 99 08)
    let rxFreq_AB = this.bytesFromString(this.rxFreq, "freq"); //  rxFreq - (string) 09 – 123.45678 (ends with 09 AF)
    let strRxCtsDcs_AB = this.bytesFromString(this.strRxCtsDcs, "ctsdcs"); // strRxCtsDcs (string) 05 – D754I
    let txFreq_AB = this.bytesFromString(this.txFreq, "freq"); // txFreq - (string) 09 – 123.45678 (ends with 09 AF)
    let strTxCtsDcs_AB = this.bytesFromString(this.strTxCtsDcs, "ctsdcs"); // strTxCtsDcs (string) 05 – D754I
    let busyLock_AB = getU32(this.busyLock); // busyLock 01 00 00 00 (0-Off,1-On)
    let txPower_AB = getU32(this.txPower); // txPower 01 00 00 00 (0-H,1-L)
    let bandwide_AB = getU32(this.bandwide); // bandwide 01 00 00 00 (0-W,1-N)
    let scanAdd_AB = getU32(this.scanAdd); // scanAdd 01 00 00 00 (0-Del,1-Add)
    let sqMode_AB = getU32(this.sqMode); // sqMode 02 00 00 00 (0-SQ-DQT,1- SQ-DQT*DTMF,2- SQ-DQT+DTMF)
    let pttid_AB = getU32(this.pttid); // pttid 03 00 00 00 (0-Off,1-BOT,2-EOT,3-Both)
    let signalGroup_AB = getU32(this.signalGroup); // signalGroup 13 00 00 00 (0-19 = 1-20)
    let fhss_AB = getU32(this.fhss); // fhss 01 00 00 00 (0-Off,1-On)
    let cName_AB = this.bytesFromString(this.cName, "name"); // name (String) 04 - NAME

    //get buffer size
    let bufferSize = 13;
    bufferSize += rxFreq_AB.byteLength;
    bufferSize += strRxCtsDcs_AB.byteLength;
    bufferSize += txFreq_AB.byteLength;
    bufferSize += strTxCtsDcs_AB.byteLength;
    bufferSize += 32; // all 4 byte values total
    bufferSize += cName_AB.byteLength;

    //create buffer
    let index = 0;
    let buffer = new Uint8Array(bufferSize);

    for (var i = 0; i < 13; i++) {
      buffer[index] = id_AB[i];
      index += 1;
    }

    for (var i = 0; i < rxFreq_AB.byteLength; i++) {
      buffer[index] = rxFreq_AB[i];
      index += 1;
    }

    for (var i = 0; i < strRxCtsDcs_AB.byteLength; i++) {
      buffer[index] = strRxCtsDcs_AB[i];
      index += 1;
    }

    for (var i = 0; i < txFreq_AB.byteLength; i++) {
      buffer[index] = txFreq_AB[i];
      index += 1;
    }

    for (var i = 0; i < strTxCtsDcs_AB.byteLength; i++) {
      buffer[index] = strTxCtsDcs_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = busyLock_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = txPower_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = bandwide_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = scanAdd_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = sqMode_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = pttid_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = signalGroup_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = fhss_AB[i];
      index += 1;
    }

    for (var i = 0; i < cName_AB.byteLength; i++) {
      buffer[index] = cName_AB[i];
      index += 1;
    }

    //return buffer

    this.chanIndex += 1;
    let uvBuffer = new UV17Buffer(buffer, this.chanIndex, this.strIndex);
    return uvBuffer;
  }

  formatFreq(freq) {
    freq = String(freq).trim();

    if (freq.includes(".") == false) {
      freq = freq.slice(0, 3) + "." + freq.slice(3);
    }

    let size = freq.length;

    if (size > 9) {
      freq = freq.slice(0, 9);
    } else if (size < 9) {
      for (var i = size; i < 9; i++) {
        freq = freq + "0";
      }
    }
    //TODO add format
    return freq;
  }

  createID(sep = 0x2e) {
    let id_AB = new ArrayBuffer(13);
    // Set id
    id_AB[0] = 0x01;

    let index_buf = new Uint16Array(1);
    index_buf[0] = this.chanIndex;

    let index = int16to8(index_buf);

    id_AB[1] = index[0];
    id_AB[2] = index[1];

    id_AB[5] = sep;

    return id_AB;
  }

  bytesFromString(str, type) {
    let buffer = bytesFromString(
      str,
      type,
      this.strIndex,
      this.freqIndex,
      this.qtIndex
    );
    this.strIndex++;
    return buffer;
  }

  isEmpty() {
    if (
      this.txFreq.trim() == "" &&
      this.rxFreq.trim() == "" &&
      this.strTxCtsDcs.trim() == "" &&
      this.strRxCtsDcs.trim() == "" &&
      this.cName.trim() == ""
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export class Zone {
  channels = [];
  maxChannels = 100;
  name = "";

  constructor(channels = [], maxChannels = 100) {
    this.channels = channels;
    this.maxChannels = maxChannels;
  }

  addChannel(chan) {
    if (this.channels.length < this.maxChannels) {
      this.channels.push(chan);
    }
  }

  setChannel(chan, index) {
    this.channels[index] = chan;
  }

  removeChannel(index) {
    this.channels.splice(index, 1);
  }

  getChannel(index) {
    if (index < this.channels.length) {
      return this.channels[index];
    } else {
      return new UV17Channel();
    }
  }

  getChannelCount() {
    return this.channels.length;
  }

  clearChannels() {
    this.channels = [];
  }

  setName(val) {
    this.name = val;
  }

  getName() {
    return this.name;
  }
}

export class RadioProgram {
  zones = [];
  maxZones = 10;

  //global values
  //Must be in this order to generate global dat
  globalValues = {
    sql: 3,
    savemode: 1,
    voxswitch: 0,
    voxlv: 0,
    voxdlytime: 5,
    dualstandby: 1,
    tot: 2,
    beep: 3,
    sidetone: 0,
    scanmode: 1,
    voicesw: 1,
    lang: 0,
    sendiddelay: 6,
    chadisplay: 0,
    chbdisplay: 0,
    keyautolock: 0,
    micgain: 0,
    alarmmode: 0,
    soundalarm: 0,
    tailclear: 1,
    rpttailclear: 5,
    rpttaildelay: 5,
    roger: 0,
    fm: 0,
    workmodea: 0,
    workmodeb: 0,
    keylock: 0,
    autopowerof: 0,
    powerdisp: 0,
    pilottone: 2,
    signalingsystem: 0,
    backlighttimer: 3,
    menuquittimer: 1,
    key1short: 0,
    key1long: 0,
    skey2short: 0,
    key2long: 0,
    bright: 0,
    enablemenurst: 1,
    totalarm: 3,
    gpsswitch: 0,
    gpsmode: 2,
    qtsavemode: 0,
  };

  vfoA = {
    rxfreq: "440.62500",
    rxqt: "OFF",
    txqt: "OFF",
    bcl: 0,
    sqmode: 0,
    power: 0,
    bandwide: 0,
    step: 0,
    signalling: 0,
    offsetdir: 0,
    offset: "000.0000",
    fhss: 0,
  };

  vfoB = {
    rxfreq: "145.62500",
    rxqt: "OFF",
    txqt: "OFF",
    bcl: 0,
    sqmode: 0,
    power: 0,
    bandwide: 0,
    step: 0,
    signalling: 0,
    offsetdir: 0,
    offset: "000.0000",
    fhss: 0,
  };

  vfoOpts = {
    scanlow: 401,
    scanhigh: 480,
    bcl: 0,
    pttid: 0,
  };

  dtmfGlobal = {
    localid: "100",
    group: "",
    groupname: "",
    wordtime: 1,
    idletime: 1,
    hanguptime: 0,
  };

  dtmfContact = {
    name: "",
    code: "",
  };

  dtmfContacts = [];

  constructor(maxZones = 10) {
    this.maxZones = maxZones;
    for (var i = 0; i < maxZones; i++) {
      let zone = new Zone();
      zone.setName(`Zone ${i + 1}`);
      this.zones.push(zone);
    }

    for (var i = 0; i < 20; i++) {
      let c = Object.assign({}, this.dtmfContact);
      c["name"] = `Contact ${i + 1}`;
      c["code"] = String(i + 101);
      this.dtmfContacts.push(c);
    }
  }

  clearZones() {
    for (var i = 0; i < this.zones.length; i++) {
      this.zones[i].clearChannels();
    }
  }

  getZone(index) {
    return this.zones[index];
  }

  addChannel(zoneIndex = 0, c) {
    this.zones[zoneIndex].addChannel(c);
  }

  setGlobalValue(name, val) {
    this.globalValues[name] = val;
  }

  getGlobalValue(name) {
    return this.globalValues[name];
  }

  genertateDatHead(model = "UV17PROU") {
    let headAB = [];

    let headString =
      "00 01 00 00 00 FF FF FF FF 01 00 00 00 00 00 00 00 0C 02 00 00 00 41 42 46 2D 55 56 73 20 43 50 53 2C 20 56 65 72 73 69 6F 6E 3D 31 2E 32 2E 34 2E 35 2C 20 43 75 6C 74 75 72 65 3D 6E 65 75 74 72 61 6C 2C 20 50 75 62 6C 69 63 4B 65 79 54 6F 6B 65 6E 3D 6E 75 6C 6C 05 01 00 00 00 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 41 70 70 44 61 74 61 0D 00 00 00 09 73 74 72 41 72 65 61 43 4E 09 73 74 72 41 72 65 61 45 4E 0B 63 68 61 6E 6E 65 6C 4C 69 73 74 08 63 68 61 6E 6E 65 6C 73 04 76 66 6F 73 07 66 75 6E 43 66 67 73 03 66 6D 73 05 64 74 6D 66 73 08 61 72 65 61 4E 61 6D 65 08 6C 69 6E 65 31 4D 73 67 08 6C 69 6E 65 32 4D 73 67 0D 68 61 6E 64 53 68 61 6B 65 43 6F 64 65 05 6D 6F 64 65 6C 06 06 04 04 04 04 04 04 06 01 01 01 01 17 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 5B 5D 5B 5D 02 00 00 00 15 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 5B 5D 02 00 00 00 14 42 46 5F 48 38 30 32 5F 43 50 53 2E 56 46 4F 49 6E 66 6F 73 02 00 00 00 14 42 46 5F 48 38 30 32 5F 43 50 53 2E 46 75 6E 63 74 69 6F 6E 02 00 00 00 15 42 46 5F 48 38 30 32 5F 43 50 53 2E 46 4D 43 68 61 6E 6E 65 6C 02 00 00 00 10 42 46 5F 48 38 30 32 5F 43 50 53 2E 44 54 4D 46 02 00 00 00 02 00 00 00 09 03 00 00 00 09 04 00 00 00 09 05 00 00 00 09 06 00 00 00 09 07 00 00 00 09 08 00 00 00 09 09 00 00 00 09 0A 00 00 00 09 04 00 00 00 06 0C 00 00 00 0C 20 20 20 57 65 6C 63 6F 6D 65 20 20 06 0D 00 00 00 0C 20 20 20 20 20 20 20 20 20 20 20 20 06 0E 00 00 00 10 50 52 4F 47 52 41 4D 43 4F 4C 4F 52 50 52 4F 55";

    headAB.push(this.convertHexStr2AB(headString));

    headAB.push(bytesFromString("UV17PRO", "name", 15));

    headString =
      "11 03 00 00 00 0A 00 00 00 06 10 00 00 00 09 E5 8C BA E5 9F 9F E4 B8 80 06 11 00 00 00 09 E5 8C BA E5 9F 9F E4 BA 8C 06 12 00 00 00 09 E5 8C BA E5 9F 9F E4 B8 89 06 13 00 00 00 09 E5 8C BA E5 9F 9F E5 9B 9B 06 14 00 00 00 09 E5 8C BA E5 9F 9F E4 BA 94 06 15 00 00 00 09 E5 8C BA E5 9F 9F E5 85 AD 06 16 00 00 00 09 E5 8C BA E5 9F 9F E4 B8 83 06 17 00 00 00 09 E5 8C BA E5 9F 9F E5 85 AB 06 18 00 00 00 09 E5 8C BA E5 9F 9F E4 B9 9D 06 19 00 00 00 09 E5 8C BA E5 9F 9F E5 8D 81 11 04 00 00 00 0A 00 00 00";

    headAB.push(this.convertHexStr2AB(headString));

    headAB.push(this.genertateDatZones());

    headString =
      "07 05 00 00 00 01 01 00 00 00 0A 00 00 00 04 15 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 5B 5D 02 00 00 00 09 24 00 00 00 09 25 00 00 00 09 26 00 00 00 09 27 00 00 00 09 28 00 00 00 09 29 00 00 00 09 2A 00 00 00 09 2B 00 00 00 09 2C 00 00 00 09 2D 00 00 00 07 06 00 00 00 00 01 00 00 00 80 00 00 00 04 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 02 00 00 00 09 2E 00 00 00 09 2F 00 00 00 09 30 00 00 00 09 31 00 00 00 09 32 00 00 00 09 33 00 00 00 09 34 00 00 00 09 35 00 00 00 09 36 00 00 00 09 37 00 00 00 09 38 00 00 00 09 39 00 00 00 09 3A 00 00 00 09 3B 00 00 00 09 3C 00 00 00 09 3D 00 00 00 09 3E 00 00 00 09 3F 00 00 00 09 40 00 00 00 09 41 00 00 00 09 42 00 00 00 09 43 00 00 00 09 44 00 00 00 09 45 00 00 00 09 46 00 00 00 09 47 00 00 00 09 48 00 00 00 09 49 00 00 00 09 4A 00 00 00 09 4B 00 00 00 09 4C 00 00 00 09 4D 00 00 00 09 4E 00 00 00 09 4F 00 00 00 09 50 00 00 00 09 51 00 00 00 09 52 00 00 00 09 53 00 00 00 09 54 00 00 00 09 55 00 00 00 09 56 00 00 00 09 57 00 00 00 09 58 00 00 00 09 59 00 00 00 09 5A 00 00 00 09 5B 00 00 00 09 5C 00 00 00 09 5D 00 00 00 09 5E 00 00 00 09 5F 00 00 00 09 60 00 00 00 09 61 00 00 00 09 62 00 00 00 09 63 00 00 00 09 64 00 00 00 09 65 00 00 00 09 66 00 00 00 09 67 00 00 00 09 68 00 00 00 09 69 00 00 00 09 6A 00 00 00 09 6B 00 00 00 09 6C 00 00 00 09 6D 00 00 00 09 6E 00 00 00 09 6F 00 00 00 09 70 00 00 00 09 71 00 00 00 09 72 00 00 00 09 73 00 00 00 09 74 00 00 00 09 75 00 00 00 09 76 00 00 00 09 77 00 00 00 09 78 00 00 00 09 79 00 00 00 09 7A 00 00 00 09 7B 00 00 00 09 7C 00 00 00 09 7D 00 00 00 09 7E 00 00 00 09 7F 00 00 00 09 80 00 00 00 09 81 00 00 00 09 82 00 00 00 09 83 00 00 00 09 84 00 00 00 09 85 00 00 00 09 86 00 00 00 09 87 00 00 00 09 88 00 00 00 09 89 00 00 00 09 8A 00 00 00 09 8B 00 00 00 09 8C 00 00 00 09 8D 00 00 00 09 8E 00 00 00 09 8F 00 00 00 09 90 00 00 00 09 91 00 00 00 09 92 00 00 00 09 93 00 00 00 09 94 00 00 00 09 95 00 00 00 09 96 00 00 00 09 97 00 00 00 09 98 00 00 00 09 99 00 00 00 09 9A 00 00 00 09 9B 00 00 00 09 9C 00 00 00 09 9D 00 00 00 09 9E 00 00 00 09 9F 00 00 00 09 A0 00 00 00 09 A1 00 00 00 09 A2 00 00 00 09 A3 00 00 00 09 A4 00 00 00 09 A5 00 00 00 09 A6 00 00 00 09 A7 00 00 00 09 A8 00 00 00 09 A9 00 00 00 09 AA 00 00 00 09 AB 00 00 00 09 AC 00 00 00 09 AD 00 00 00 05 07 00 00 00 14 42 46 5F 48 38 30 32 5F 43 50 53 2E 56 46 4F 49 6E 66 6F 73 1C 00 00 00 08 76 66 6F 41 46 72 65 71 0F 73 74 72 56 46 4F 41 52 78 43 74 73 44 63 73 0F 73 74 72 56 46 4F 41 54 78 43 74 73 44 63 73 0C 76 66 6F 41 42 75 73 79 6C 6F 63 6B 07 76 66 6F 41 44 69 72 0F 76 66 6F 41 53 69 67 6E 61 6C 47 72 6F 75 70 0B 76 66 6F 41 54 78 50 6F 77 65 72 0C 76 66 6F 41 42 61 6E 64 77 69 64 65 0A 76 66 6F 41 53 51 4D 6F 64 65 08 76 66 6F 41 53 74 65 70 08 76 66 6F 41 46 68 73 73 0A 76 66 6F 41 4F 66 66 73 65 74 08 76 66 6F 42 46 72 65 71 0F 73 74 72 56 46 4F 42 52 78 43 74 73 44 63 73 0F 73 74 72 56 46 4F 42 54 78 43 74 73 44 63 73 0C 76 66 6F 42 42 75 73 79 4C 6F 63 6B 07 76 66 6F 42 44 69 72 0F 76 66 6F 42 53 69 67 6E 61 6C 47 72 6F 75 70 0B 76 66 6F 42 54 78 50 6F 77 65 72 0C 76 66 6F 42 42 61 6E 64 77 69 64 65 0A 76 66 6F 42 53 51 4D 6F 64 65 08 76 66 6F 42 53 74 65 70 08 76 66 6F 42 46 68 73 73 0A 76 66 6F 42 4F 66 66 73 65 74 08 76 66 6F 70 74 74 69 64 08 62 75 73 79 4C 6F 63 6B 0D 76 66 6F 53 63 61 6E 52 61 6E 67 5F 4C 0D 76 66 6F 53 63 61 6E 52 61 6E 67 5F 48 01 01 01 00 00 00 00 00 00 00 00 01 01 01 01 00 00 00 00 00 00 00 00 01 00 00 00 00 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 05 05 02 00 00 00";

    headAB.push(this.convertHexStr2AB(headString));

    headAB.push(this.generateVFOBuffer(this.vfoA, 174));
    headAB.push(this.generateVFOBuffer(this.vfoB, 178));
    headAB.push(this.generateVFOoptBuffer(this.vfoOpts));

    // Global Functions
    headString =
      "05 08 00 00 00 14 42 46 5F 48 38 30 32 5F 43 50 53 2E 46 75 6E 63 74 69 6F 6E 2B 00 00 00 03 73 71 6C 08 73 61 76 65 4D 6F 64 65 05 76 6F 78 53 77 03 76 6F 78 0A 76 6F 78 44 6C 79 54 69 6D 65 0B 64 75 61 6C 53 74 61 6E 64 62 79 03 74 6F 74 04 62 65 65 70 08 73 69 64 65 54 6F 6E 65 08 73 63 61 6E 4D 6F 64 65 07 76 6F 69 63 65 53 77 05 76 6F 69 63 65 06 70 74 74 44 6C 79 0A 63 68 41 44 69 73 54 79 70 65 0A 63 68 42 44 69 73 54 79 70 65 08 61 75 74 6F 4C 6F 63 6B 07 6D 69 63 47 61 69 6E 09 61 6C 61 72 6D 4D 6F 64 65 09 61 6C 61 72 6D 54 6F 6E 65 09 74 61 69 6C 43 6C 65 61 72 0C 72 70 74 54 61 69 6C 43 6C 65 61 72 0A 72 70 74 54 61 69 6C 44 65 74 05 72 6F 67 65 72 08 66 6D 45 6E 61 62 6C 65 0B 63 68 41 57 6F 72 6B 6D 6F 64 65 0B 63 68 42 57 6F 72 6B 6D 6F 64 65 07 6B 65 79 4C 6F 63 6B 0C 61 75 74 6F 50 6F 77 65 72 4F 66 66 0E 70 6F 77 65 72 4F 6E 44 69 73 54 79 70 65 04 74 6F 6E 65 0F 73 69 67 6E 61 6C 69 6E 67 53 79 73 74 65 6D 09 62 61 63 6B 6C 69 67 68 74 0C 6D 65 6E 75 51 75 69 74 54 69 6D 65 09 6B 65 79 31 53 68 6F 72 74 08 6B 65 79 31 4C 6F 6E 67 09 6B 65 79 32 53 68 6F 72 74 08 6B 65 79 32 4C 6F 6E 67 06 62 72 69 67 68 74 07 72 73 74 4D 65 6E 75 08 74 6F 74 41 6C 61 72 6D 05 67 70 73 53 77 07 67 70 73 4D 6F 64 65 0E 63 74 73 44 63 73 53 63 61 6E 54 79 70 65 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 08 02 00 00 00";
    headAB.push(this.convertHexStr2AB(headString));
    headAB.push(this.generateDatGlobal());

    //FM Channel
    headString =
      "05 09 00 00 00 15 42 46 5F 48 38 30 32 5F 43 50 53 2E 46 4D 43 68 61 6E 6E 65 6C 02 00 00 00 08 63 68 61 6E 6E 65 6C 73 07 63 75 72 46 72 65 71 07 00 08 08 02 00 00 00 09 B6 00 00 00 88 03 00 00";
    headAB.push(this.convertHexStr2AB(headString));

    //DTMF Global
    headString =
      "05 0A 00 00 00 10 42 46 5F 48 38 30 32 5F 43 50 53 2E 44 54 4D 46 06 00 00 00 07 6C 6F 63 61 6C 49 44 05 67 72 6F 75 70 09 67 72 6F 75 70 4E 61 6D 65 08 77 6F 72 64 54 69 6D 65 08 69 64 6C 65 54 69 6D 65 06 68 61 6E 67 55 70 01 06 06 00 00 00 08 08 08 02 00 00 00";
    headAB.push(this.convertHexStr2AB(headString));

    headAB.push(bytesFromString(this.dtmfGlobal["localid"], "name", 183));
    headAB.push(bytesFromString(this.dtmfGlobal["group"], "name", 184,184,185));
    headAB.push(bytesFromString(this.dtmfGlobal["groupname"], "name", 185,185,185));
    headAB.push(getU32(this.dtmfGlobal["wordtime"]));
    headAB.push(getU32(this.dtmfGlobal["idletime"]));
    headAB.push(getU32(this.dtmfGlobal["hanguptime"]));

    //Channel Indexes
    //headString = "07 24 00 00 00 00 01 00 00 00 64 00 00 00 04 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C";
    //headAB.push(this.convertHexStr2AB(headString));

    let chIndexes = this.generateChIndexesBuffer(36, 186);

    for (var i = 0; i < chIndexes.length; i++) {
      headAB.push(chIndexes[i]);
    }

    headString =
      "05 2E 00 00 00 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 0E 00 00 00 02 69 64 06 72 78 46 72 65 71 0B 73 74 72 52 78 43 74 73 44 63 73 06 74 78 46 72 65 71 0B 73 74 72 54 78 43 74 73 44 63 73 08 62 75 73 79 4C 6F 63 6B 07 74 78 50 6F 77 65 72 08 62 61 6E 64 77 69 64 65 07 73 63 61 6E 41 64 64 06 73 71 4D 6F 64 65 05 70 74 74 69 64 0B 73 69 67 6E 61 6C 47 72 6F 75 70 04 66 68 73 73 04 6E 61 6D 65 00 01 01 01 01 00 00 00 00 00 00 00 00 01 08 08 08 08 08 08 08 08 08 02 00 00 00 00 00 00 00 06";

    headAB.push(this.convertHexStr2AB(headString));

    let c = new UV17Channel(46, 0);
    //alert(c.getChannelBuffer());
    let firstChan = c.getChannelBuffer(46, 0).getBuffer();
    firstChan = firstChan.slice(13, firstChan.length);

    //shift and add an extra 0
    for (var i = 0; i < 4; i++) {
      firstChan[i] = firstChan[i + 1];
    }

    headAB.push(firstChan);

    for (var i = 0; i <= 126; i++) {
      headAB.push(c.getChannelBuffer(47 + i, 0).getBuffer());
    }

    headString =
      "0F B6 00 00 00 0F 00 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 11 B8 00 00 00 14 00 00 00";

    headAB.push(this.convertHexStr2AB(headString));

    for (var i = 0; i < 20; i++) {
      headAB.push(
        bytesFromString(this.dtmfContacts[i]["code"], "name", 1699 + i)
      );
    }

    headString = "11 B9 00 00 00 14 00 00 00";
    headAB.push(this.convertHexStr2AB(headString));

    for (var i = 0; i < 20; i++) {
      headAB.push(
        bytesFromString(this.dtmfContacts[i]["name"], "name", 1719 + i)
      );
    }

    return headAB;
  }

  convertHexStr2AB(hexStr) {
    hexStr = hexStr.trim();
    let tempList = hexStr.split(" ");
    let list = [];

    for (var i = 0; i < tempList.length; i++) {
      list.push("0x" + tempList[i]);
    }

    let ab = new Uint8Array(list);

    return ab;
  }

  genertateDatZones() {
    let zonesAB = [];
    let cIndex = 26;
    //get buffer size
    let bufferSize = 0;

    for (var i = 0; i < this.maxZones; i++) {
      let c = new UV17Channel(0, cIndex);
      zonesAB[i] = c.bytesFromString(this.getZone(i).name);
      cIndex++;
      bufferSize += zonesAB[i].byteLength;
    }

    let buffer = new Uint8Array(bufferSize);

    let index = 0;
    for (var i = 0; i < this.maxZones; i++) {
      for (var z = 0; z < zonesAB[i].byteLength; z++) {
        buffer[index] = zonesAB[i][z];
        index++;
      }
    }

    return buffer;
  }

  generateDatGlobal() {
    let buffer = new Uint8Array(172);
    let index = 0;

    var keys = Object.keys(this.globalValues);

    for (var i = 0; i < keys.length; i++) {
      let gv = getU32(this.globalValues[keys[i]]);
      //let gv = getU32(0);
      for (var j = 0; j < 4; j++) {
        buffer[index] = gv[j];
        index += 1;
      }
    }

    return buffer;
  }

  generateChIndexesBuffer(groupIndex, sIndex) {
    let chs = [];
    for (var i = 0; i < 10; i++) {
      chs.push(this.generateCHGroupBuffer(groupIndex, sIndex));
      groupIndex++;
      sIndex += 100;
    }

    return chs;
  }

  generateCHGroupBuffer(groupIndex, sIndex) {
    /*
      07 24 00 00 00 00 01 00 00 00 64 00 00 00 04 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 02 00 00 00 09 B9 00 00 00

      39
    */
    let buffer = new Uint8Array(539);
    let headString =
      "07 00 00 00 00 00 01 00 00 00 64 00 00 00 04 13 42 46 5F 48 38 30 32 5F 43 50 53 2E 43 68 61 6E 6E 65 6C 02 00 00 00";

    let hb = this.convertHexStr2AB(headString);

    for (var i = 0; i < 39; i++) {
      buffer[i] = hb[i];
    }

    buffer[1] = parseInt(groupIndex);

    let index = 39;
    for (var i = 0; i < 100; i++) {
      let ch_AB = this.generateChanIndex(parseInt(sIndex));
      for (var j = 0; j < 5; j++) {
        buffer[index] = ch_AB[j];

        index++;
      }
      sIndex++;
    }

    return buffer;
  }

  generateChanIndex(index) {
    let ch_AB = new Uint8Array(6);

    ch_AB[0] = 0x09;

    let index_buf = new Uint16Array(1);
    index_buf[0] = index;

    ch_AB[1] = index_buf[0] & 0xff;
    ch_AB[2] = (index_buf[0] >> 8) & 0xff;

    return ch_AB;
  }
  generateDatBuffer() {
    let ab = [];

    let head = this.genertateDatHead();
    for (var i = 0; i < head.length; i++) {
      ab.push(head[i]);
    }

    let chanIndex = 186;
    let strIndex = 1739;

    for (var zone = 0; zone < this.maxZones; zone++) {
      for (var chan = 0; chan < this.getZone(zone).maxChannels; chan++) {
        let c = this.zones[zone].getChannel(chan);
        c.strIndex = strIndex;
        c.chanIndex = chanIndex;

        let cb = c.getChannelBuffer();
        ab.push(cb.getBuffer());

        if (c.isEmpty) {
          strIndex += 4;
        } else {
          strIndex += 5;
        }

        chanIndex += 1;
      }
    }

    //Close program
    let close = new Uint8Array([0x0b]);
    ab.push(close);

    return ab;
  }

  generateVFOBuffer(vfo, strIndex) {
    /*
     vfoA = {
    rxfreq: "440.62500",
    rxqt: "",
    txqt: "",

    sqmode: 0,
    power: 0,
    wideband: 0,
    step: 0,
    signalling: 0,
    offsetdir: 0,
    offset: "",
    fhss: 0,
  };

    */
    let rxFreq_AB = bytesFromString(vfo["rxfreq"], "freq", strIndex); //  rxFreq - (string) 09 – 123.45678 (ends with 09 AF)
    strIndex++;
    let rxqt_AB = bytesFromString(vfo["rxqt"], "ctsdcs", strIndex);
    strIndex++;
    let txqt_AB = bytesFromString(vfo["txqt"], "ctsdcs", strIndex);
    strIndex++;
    let bcl_AB = getU32(vfo["bcl"]);
    let sqMode_AB = getU32(vfo["sqmode"]);
    let power_AB = getU32(vfo["power"]);
    let bandwide_AB = getU32(vfo["bandwide"]);
    let step_AB = getU32(vfo["step"]);
    let signalling_AB = getU32(vfo["signalling"]);
    let offsetDir_AB = getU32(vfo["offsetdir"]);
    let offset_AB = bytesFromString(vfo["offset"], "freq", strIndex);
    strIndex++;
    let fhss_AB = getU32(vfo["fhss"]);

    //get buffer size
    let bufferSize = rxFreq_AB.byteLength;
    bufferSize += rxqt_AB.byteLength;
    bufferSize += txqt_AB.byteLength;
    bufferSize += 32; // all the 4byte U23s
    bufferSize += offset_AB.byteLength;

    //create buffer
    let index = 0;
    let buffer = new Uint8Array(bufferSize);

    for (var i = 0; i < rxFreq_AB.byteLength; i++) {
      buffer[index] = rxFreq_AB[i];
      index += 1;
    }

    for (var i = 0; i < rxqt_AB.byteLength; i++) {
      buffer[index] = rxqt_AB[i];
      index += 1;
    }

    for (var i = 0; i < txqt_AB.byteLength; i++) {
      buffer[index] = txqt_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = bcl_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = offsetDir_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = signalling_AB[i];
      index += 1;
    }
    for (var i = 0; i < 4; i++) {
      buffer[index] = power_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = bandwide_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = sqMode_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = step_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = fhss_AB[i];
      index += 1;
    }

    for (var i = 0; i < offset_AB.byteLength; i++) {
      buffer[index] = offset_AB[i];
      index += 1;
    }

    //return buffer
    return buffer;
  }

  generateVFOoptBuffer() {
    /*
scanlow: 400,
    scanhigh: 480,
    bcl: 0,
    pttid: 3,
    */

    let bcl_AB = getU32(this.vfoOpts["sqmode"]);
    let pttId_AB = getU32(this.vfoOpts["pttid"]);
    let sl_AB = bytesFromString(this.vfoOpts["scanlow"], "name", -1);
    let sh_AB = bytesFromString(this.vfoOpts["scanhigh"], "name", -1);

    //get buffer size
    let bufferSize = sl_AB.byteLength;
    bufferSize += sh_AB.byteLength;
    bufferSize += 8; // all the 4byte U23s

    //create buffer
    let index = 0;
    let buffer = new Uint8Array(bufferSize);

    for (var i = 0; i < 4; i++) {
      buffer[index] = bcl_AB[i];
      index += 1;
    }

    for (var i = 0; i < 4; i++) {
      buffer[index] = pttId_AB[i];
      index += 1;
    }

    for (var i = 0; i < sl_AB.byteLength; i++) {
      buffer[index] = sl_AB[i];
      index += 1;
    }

    for (var i = 0; i < sh_AB.byteLength; i++) {
      buffer[index] = sh_AB[i];
      index += 1;
    }

    //return buffer
    return buffer;
  }
}

function getU32(val) {
  let rVal = new Uint8Array(4);
  rVal[0] = val;

  return rVal;
}

function int16to8(buffer) {
  let int8 = new Uint8Array(2);

  int8[0] = buffer[0] & 0xff;
  int8[1] = (buffer[0] >> 8) & 0xff;

  return int8;
}

function bytesFromString(
  str,
  type = "name",
  index = 1,
  freqIndex = 1185,
  qtIndex = 164
) {
  let strBytes;
  let freq_AB = new Uint16Array(1);
  freq_AB[0] = freqIndex;
  let int8Freq = int16to8(freq_AB);

  let qt_AB = new Uint16Array(1);
  qt_AB[0] = qtIndex;
  let int8Qt = int16to8(qt_AB);

  str = String(str).trim();
  if (str.length == 0) {
    if (type == "zone") {
      return strBytes;
    } else if (type == "freq" || type == "name") {
      //Empty strings default to this
      strBytes = new Uint8Array(5);
      //09 AF 00 00
      strBytes[0] = 0x09;
      strBytes[1] = int8Freq[0];
      strBytes[2] = int8Freq[1];
      strBytes[3] = 0x00;
      strBytes[4] = 0x00;

      return strBytes;
    } else {
      //Empty strings default to this
      strBytes = new Uint8Array(5);
      //09 AF 00 00
      strBytes[0] = 0x09;
      strBytes[1] = int8Qt[0];
      strBytes[2] = int8Qt[1];
      strBytes[3] = 0x00;
      strBytes[4] = 0x00;

      return strBytes;
    }
  } else {
    //-1
    if (index < 0) {
      strBytes = new Uint8Array(str.length + 1);

      strBytes[0] = str.length;

      for (var i = 1; i < str.length + 1; i++) {
        strBytes[i] = str.charCodeAt(i - 1);
      }
    } else {
      strBytes = new Uint8Array(str.length + 6);
      strBytes[0] = 0x06;

      let index_buf = new Uint16Array(1);
      index_buf[0] = index;

      let int8 = int16to8(index_buf);

      strBytes[1] = int8[0];
      strBytes[2] = int8[1];

      strBytes[5] = str.length;

      for (var i = 6; i < str.length + 6; i++) {
        strBytes[i] = str.charCodeAt(i - 6);
      }
    }

    return strBytes;
  }
}
