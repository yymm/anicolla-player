import * as fs from 'fs';
import { compress } from 'compress-json'

const source = "src/assets/fixed_records.json";
const output = "src/assets/origin_records.json"

const rawData = fs.readFileSync(source, 'utf-8');
const data = JSON.parse(rawData);
console.log(`Success to load and parse ${source}`);

let compressed = compress(data)
console.log(`Success to compress`);

fs.writeFileSync(output, JSON.stringify(compressed), 'utf-8');
console.log(`Success to write ${output}`);
