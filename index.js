// @ts-check
require(`dotenv`).load();
const { red, green, magenta, yellow, c, log } = require(`x-chalk`);
const { sync: glob } = require(`glob`);
const { uploadFile, md5File: cloudMd5File } = require(`@friends-library/cloud`);
const md5File = require(`md5-file`);
const exec = require(`x-exec`).default;

const rootDir = process.env.ROOT_DIR;

const allFiles = glob(`${rootDir}/**/*.{epub,mobi,pdf,mp3}`, { nodir: true });

log(c`{gray starting transfer of} {cyan ${allFiles.length}} {gray files}`);

async function main() {
  for (const localPath of allFiles) {
    const relpath = localPath.replace(`${rootDir}/`, ``);
    const cloudPath = `storage/msf-site-backup/assets/${relpath}`;
    const parts = relpath.split(`/`);
    parts.pop();
    const dir = parts.join(`/`);
    log(c`starting transfer of file {magenta ${relpath}}`);
    exec.exit(`ssh jared@165.227.211.142 "mkdir -p /home/jared/assets/${dir}"`);
    exec.exit(`scp -q ${localPath} jared@165.227.211.142:/home/jared/assets/${relpath}`);
    // ssh user@host "mkdir -p /target/path/" &&
    // scp /path/to/source user@host:/target/path/
    // await verify(localPath, cloudPath);
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
  } else {
    log(c`{gray verified hashes for} {cyan ${localPath.replace(rootDir, ``)}}`);
  }
}

main();
