const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "market.db");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this);
        });
    });

const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });

const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });

const exec = (sql) =>
    new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });

const initDb = async () => {
    const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
    const seedPath = path.join(__dirname, "..", "db", "seed.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await exec(schemaSql);

    const stockCount = await get("SELECT COUNT(*) as count FROM stocks");
    if (stockCount && stockCount.count === 0 && fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, "utf8");
        await exec(seedSql);
    }
};

module.exports = { db, run, get, all, exec, initDb };
