// @ts-check
require(`dotenv`).load();
const { red, green, magenta, yellow, c, log } = require(`x-chalk`);
const { sync: glob } = require(`glob`);

const rootDir = process.env.ROOT_DIR;

const allFiles = glob(`${rootDir}/**/*`, { nodir: true });

const fileExts = new Set();
for (const path of allFiles) {
  const ext = path.split(`.`).pop();
  fileExts.add(ext);
}

console.log(fileExts);
