// @ts-check
require(`dotenv`).load();
const { red, green, magenta, yellow, c, log } = require(`x-chalk`);
const { sync: glob } = require(`glob`);
const { uploadFile, md5File: cloudMd5File } = require(`@friends-library/cloud`);
const md5File = require(`md5-file`);

const rootDir = process.env.ROOT_DIR;

const allFiles = glob(`${rootDir}/**/*.{epub,mobi,pdf,mp3}`, { nodir: true });

log(c`{gray starting transfer of} {cyan ${allFiles.length}} {gray files}`);

async function main() {
  for (const path of allFiles) {
    const localPath = path.replace(`${rootDir}/`, ``);
    const cloudPath = `storage/msf-site-backup/assets/${localPath}`;
    await verify(localPath, cloudPath);
  }
}

async function upload(localPath, cloudPath) {
  log(c`starting transfer of file {magenta ${localPath}}`);
  await uploadFile(localPath, cloudPath);
}

async function verify(localPath, cloudPath) {
  const localHash = await md5File(localPath);
  const remoteHash = await cloudMd5File(cloudPath);
  if (!remoteHash) {
    red(`Missing remote file for ${localPath}`);
    return;
  }
  if (localHash !== remoteHash) {
    red(`non matching hashes for file ${localPath}, re-uploading`);
    return upload(localPath, cloudPath);
  }
}

main();
