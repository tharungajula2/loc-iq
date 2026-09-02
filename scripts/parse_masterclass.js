/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const md = fs.readFileSync("LOCIQ_MASTERCLASS.md", "utf8");
const lines = md.split("\n");
const map = {};
let currentKey = null;
let currentText = [];

for (const line of lines) {
  if (line.startsWith("### ")) {
    if (currentKey) {
      map[currentKey] = currentText.join("\n").trim();
    }
    let raw = line.replace("### ", "").trim();
    let cleanKey = raw;
    
    const match = raw.match(/`([^`]+)`/);
    if (match) {
      cleanKey = match[1];
    } else {
      cleanKey = raw.replace(/^\d+\.\s*/, "");
    }
    
    currentKey = cleanKey;
    currentText = [];
  } else if (line.match(/^## \d+\.\d+ /)) {
    if (currentKey) {
      map[currentKey] = currentText.join("\n").trim();
    }
    let raw = line.replace(/^## \d+\.\d+ /, "").trim();
    let cleanKey = raw;
    const match = raw.match(/`([^`]+)`/);
    if (match) {
      cleanKey = match[1];
    }
    currentKey = cleanKey;
    currentText = [];
  } else if (currentKey) {
    currentText.push(line);
  }
}
if (currentKey) {
  map[currentKey] = currentText.join("\n").trim();
}

fs.writeFileSync("src/data/masterclass.json", JSON.stringify(map, null, 2));
console.log("Parsed " + Object.keys(map).length + " items from Masterclass.");
