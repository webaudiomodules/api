import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageFilePath = path.join(__dirname, '../package.json');
const { version } = JSON.parse(fs.readFileSync(packageFilePath, 'utf-8'));

const versionFilePath = path.join(__dirname, './version.js');
if (fs.existsSync(versionFilePath)) fs.unlinkSync(versionFilePath);

fs.writeFileSync(versionFilePath, `export default ${JSON.stringify(version)};\n`);

console.log("version file generated.");
