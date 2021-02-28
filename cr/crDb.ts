import { Database, Statement } from "sqlite3";
import { Phrase } from "./data/Phrase";

/**
 * Populates DB with data
 */
export async function populate(
  db: Database,
  phrases: Array<Phrase>,
): Promise<void> {
  console.log("Populating databse...");
  await populatePhrases(db, phrases);
}

async function populatePhrases(
  db: Database,
  phrases: Array<Phrase>
) {
  console.log("Populating Phrase table...");
  let validRecords = 0;
  db.serialize();
  await new Promise<void>((resolve, reject) => {
    db.run("begin transaction", function (err: Error) {
      if (null != err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  const stmt = await new Promise<Statement>((resolve, reject) => {
    db.prepare(
      "REPLACE INTO phrase_table VALUES (?,?,?,?)",
      function (this: Statement, err: Error) {
        if (null != err) {
          reject(err);
        } else {
          resolve(this);
        }
      }
    );
  });

  for (const phrase of phrases) {
    await new Promise<void>((resolve, reject) => {
      stmt.run(
        [phrase.english, phrase.spanish, phrase.filePath, phrase.level],
        function (err: Error) {
          if (null != err) {
            reject(err);
          } else {
            resolve();
            ++validRecords;
          }
        }
      );
    });
  }
  console.log("Phrases populated");
  console.log(`Valid records: ${validRecords}`);
  await new Promise<void>((resolve, reject) => {
    stmt.finalize(function (err: Error) {
      if (null != err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await new Promise<void>((resolve, reject) => {
    db.run("commit", function (err: Error) {
      if (null != err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
