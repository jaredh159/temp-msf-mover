// @ts-check
require(`dotenv`).load();
const { red, green, magenta, yellow, c, log } = require(`x-chalk`);
const { sync: glob } = require(`glob`);

const rootDir = process.env.ROOT_DIR;

const allFiles = glob(`${rootDir}/**/*.{epub,mobi,pdf,mp3}`, { nodir: true });

const fileExts = new Set();
for (const path of allFiles) {
  const ext = path.split(`.`).pop();
  fileExts.add(ext);
}

console.log(`${allFiles.length} files`);
console.log(fileExts);
// ignore .zip files
//  ignore .txt
//  ignore .css
//  ignore .jpg
// Set { 'epub', 'mobi', 'pdf', 'mp3' }
