const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const tableName = "Terms";


function openDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      __dirname + "/DB.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) return console.error(err.message);
        console.log("DB is successfully connected");
        resolve(db);
      }
    );
  });
}

function createTable() {
  openDB();
  run(`CREATE TABLE ${tableName}("id","term","description")`);
  closeDB(db);
}

function insertDataIntoTable(body, res) {
  openDB().then((db) => {
    const sql = `INSERT INTO ${tableName}(id,term,description) VALUES(?,?,?)`;
    db.run(sql, [uuidv4(), body.term, body.description], (err, result) => {
      if (err) return console.error(err.message);
      res.status(201).send("Created");
      closeDB(db);
    });
  });
}

async function patchData(req, res) {
  console.log(req.params, req.body);
  db = await openDB();
  const sql = `UPDATE Terms SET term = ?, description = ? WHERE id = ?`;
  db.run(sql, [req.body.term, req.body.description, req.params.id], (err) => {
    if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else {
      console.log("breturn", db);
      res.status(200).send("UPDATE");
    }
  });
  closeDB(db);
}
// delete table
// db.run("DROP TABLE term")

//delete object
async function deleteData(req, res) {
  console.log("IN_DELETE", req.params);
  db = await openDB();
  sql = `DELETE FROM ${tableName} WHERE id = ?`;
  console.log("DELETE2");
  db.run(sql, [req.params.id], (err) => {
    if (err) return console.log(err.message);
    res.status(200).send("DELETED");
  });
  closeDB(db);
}

async function getALLData(req, res) {
  db = await openDB();
  const sql_SELECT = "SELECT * FROM Terms";
  console.log("DB", db);
  db.all(sql_SELECT, [], (err, rows) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(rows);
    }
  });
  closeDB(db);
}
function closeDB(db) {
  db.close((err) => {
    if (err) return console.error(err.message);
    console.log("DB_CLOSED");
  });
}

module.exports = {
  createTable,
  getALLData,
  insertDataIntoTable,
  patchData,
  deleteData,
};
