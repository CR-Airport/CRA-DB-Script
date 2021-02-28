import minimist, {ParsedArgs} from "minimist";
import {cr} from "./cr";
import * as path from "path"
import * as fs from "fs"

const PROJ_DIR = "researchSp2021"
const SCHEMA_PATH = path.join(__dirname, "..", PROJ_DIR, "app", "schemas", "com.example.crairport.db.PhraseDatabase");
const DST_PATH = path.join(__dirname, "..", PROJ_DIR, "app", "src", "main",  "assets", "databases", "cr.db");
const VERSION_PATH = path.join(__dirname, "..", PROJ_DIR, "app", "gradle.properties");
const VERSION_KEY = "CR_DB_VERSION";

interface Args extends ParsedArgs {
    dataDir: string
}

function incrementDatabaseVersion(file: string, key: string) {
    const versionRegex = new RegExp(`${key}\\s*=\\s*(\\d+)`, "gi");
    let contents = fs.readFileSync(file, "utf8");
    const matches = versionRegex.exec(contents);
    if (null === matches) {
        throw new Error("Did not find match in specified file");
    }

    const version = parseInt(matches[1]);
    const newVersion = version + 1;

    console.log("Current version: " + version + ". New version: " + newVersion);

    contents = contents.replace(versionRegex, `${key}=${newVersion}`);

    fs.writeFileSync(file, contents)
}

exports.cr = async () => {
    const options: Args = minimist<Args>(
        process.argv.slice(2),
        {
            string: ["dataDir"],
            default: { dataDir: "_data"}
        }
    );

    // 1. Create database
    const pathToNewDb = await cr(SCHEMA_PATH, options.dataDir);
    // 2. Copy to assets
    fs.copyFileSync(pathToNewDb, DST_PATH);
    // 3. Increment version
    incrementDatabaseVersion(VERSION_PATH, VERSION_KEY);
};
