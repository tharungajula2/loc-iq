import xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const workbookPath = path.resolve('Shared_Stage 1_Fraud Intelligence Project.xlsx');
const workbook = xlsx.readFile(workbookPath);

const sheetNames = workbook.SheetNames;
console.log('Found sheets:', sheetNames);

const sheetToJsonClean = (sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    
    // Find header row: the first row that has at least 3 non-empty string cells
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(10, rawData.length); i++) {
        const row = rawData[i];
        const nonEmpties = row.filter(cell => typeof cell === 'string' && cell.trim() !== '');
        if (nonEmpties.length >= 3) {
            headerRowIndex = i;
            break;
        }
    }
    
    if (headerRowIndex === -1) return [];
    
    // Some headers might have spaces or newlines, let's trim them.
    const headers = rawData[headerRowIndex].map(h => typeof h === 'string' ? h.trim() : h);
    const result = [];
    
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.every(cell => cell === "")) continue;
        
        const obj = {};
        headers.forEach((header, index) => {
            if (header && header !== "") {
                obj[header] = row[index] !== undefined ? row[index] : "";
            }
        });
        // check if object has anything
        if (Object.values(obj).some(v => v !== "")) {
            result.push(obj);
        }
    }
    return result;
};

const writeJson = (filename, data) => {
    const dir = path.resolve('src/data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2));
    console.log(`Wrote ${filename} with ${data.length} rows.`);
};

writeJson('primaryIdentifiers.json', sheetToJsonClean('3. Primary Identifiers'));
writeJson('dataFields.json', sheetToJsonClean('4. Fetched Data Fields'));
writeJson('apiUniverse.json', sheetToJsonClean('5. API Universe'));
writeJson('output.json', sheetToJsonClean('2. Output(Tentative)'));
