export class ChirpChannel {
    location = 0;
    Name = "";
    Frequency = "";
    Duplex = "";
    Offset = "";
    Tone = "";
    rToneFreq = "";
    cToneFreq = "";
    DtcsCode = "";
    DtcsPolarity = "";
    RxDtcsCode = "";
    CrossMode = "";
    Mode = "";
    TStep = "";
    Skip = "";
    Power = "";
    Name = "";
  
    constructor(index, vals) {
      this.index = index;
      this.vals = vals;
  
      for (var i = 0; i < this.index.length; i++) {
        switch (this.index[i].toLowerCase()) {
          case "location":
            this.location = vals[i];
            break;
          case "name":
            this.Name = vals[i];
            break;
          case "frequency":
            this.Frequency = vals[i];
            break;
          case "duplex":
            this.Duplex = vals[i];
            break;
          case "offset":
            this.Offset = vals[i];
            break;
          case "tone":
            this.Tone = vals[i];
            break;
          case "rtonefreq":
            this.rToneFreq = vals[i];
            break;
          case "ctonefreq":
            this.cToneFreq = vals[i];
            break;
          case "dtcscode":
            this.DtcsCode = vals[i];
            break;
          case "dtcspolarity":
            this.DtcsPolarity = vals[i];
            break;
          case "rxdtcscode":
            this.RxDtcsCode = vals[i];
            break;
          case "crossmode":
            this.CrossMode = vals[i];
            break;
          case "mode":
            this.sqMode = vals[i];
            break;
          case "tstep":
            this.TStep = vals[i];
            break;
          case "skip":
            this.Skip = vals[i];
            break;
          case "power":
            this.Power = vals[i];
            break;
          case "name":
            this.Name = vals[i];
            break;
        }
      }
    }
  }
  
  export function storecsvIndexes(line) {
    let values = line.split(",");
    localStorage.csvIndexes = JSON.stringify(values);
  }
  
  export function getcsvIndexes() {
    return JSON.parse(localStorage.getItem("csvIndexes"));
  }
  
  export function storecsvList(list) {
    let csvList = [];
  
    for (var i = 0; i < list.length; i++) {
      let line = list[i];
      let values = line.split(",");
      csvList.push(values);
    }
  
    localStorage.csvList = JSON.stringify(csvList);
  }
  
  export function getChirpChannel(index) {
    let ccIndexes = getcsvIndexes();
    let ccList = getcsvList();
  
    return new ChirpChannel(ccIndexes, ccList[index]);
  }
  
  export function getChirpChannelCount() {
    let list = getcsvList();
    if(list !== null){
      return list.length;
    }else{
      return 0;
    }
  }
  
  export function getcsvList() {
    return JSON.parse(localStorage.getItem("csvList"));
  }
  