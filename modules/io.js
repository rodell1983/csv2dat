import * as Chirp from "./chirp.js";
import * as Main from "./main.js";

export function writeDAT() {
  const response = confirm(".dat file will be saved to downloads");

  if (response) {
    const fileName = prompt("Enter file name");
    writeFile(Main.getRadioProgram().generateDatBuffer(), `${fileName}.dat`);
  }
}

const readFile = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Error"));
    };
    reader.onload = () => {
      resolve(reader.result);
      let csvList = reader.result.split("\n");
      //set first line as indexes
      let indexList = csvList[0];
      Chirp.storecsvIndexes(indexList);
      //Remove first line and store list
      csvList = csvList.splice(1);
      Chirp.storecsvList(csvList);

      Main.loadRPFromChirp(Chirp.getcsvIndexes(), Chirp.getcsvList());
    };

    reader.readAsText(file);
  });
};

const importData = async (event) => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async () => {
    var file = input.files[0];
    if (file.name.match(/\.(txt|csv)$/)) {
      try {
        const fr = await readFile(file);
      } catch (error) {}
    } else {
      alert("File not supported, .txt or .csv files only");
    }
  };
  input.click();
};

export function writeFile(buffers, fileName) {
  var file = new Blob(buffers, {
    type: "application/octet-binary;charset=utf-8",
  });
  var a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
}

document
  .getElementById("import-data-btn")
  .addEventListener("click", importData);
document.getElementById("write-dat-btn").addEventListener("click", writeDAT);
