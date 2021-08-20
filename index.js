// @ts-check
require(`dotenv`).load();
const { red, green, magenta, yellow, c, log } = require(`x-chalk`);
const { sync: glob } = require(`glob`);

const rootDir = process.env.ROOT_DIR;

const allFiles = glob(`${rootDir}/**/*.{epub,mobi,pdf,mp3}`, { nodir: true });

log(c`{gray starting transfer of} {cyan ${allFiles.length}} {gray files}`);

for (const path of allFiles) {
  const relpath = path.replace(`${rootDir}/`, ``);
  const cloudPath = `storage/msf-site/assets/${relpath}`;
  log(c`starting transfer of file {magenta ${relpath}}`);
  console.log({ localPath: path, cloudPath });
}
