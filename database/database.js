const sqlite3 = require("sqlite3").verbose();
const tableName = "term"

let database

class DBCommon {
  constructor(path, callback) {
    database = new sqlite3.Database(path, callback)
  }
  get() {
    return database
  }
}


// const db = new sqlite3.Database("./db.db", sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err.message);
//     console.log("successfully connected");
//   });

// function openDB() {
//     const db = new sqlite3.Database("./db.db", sqlite3.OPEN_READWRITE, (err) => {
//         if (err) return console.error(err.message);
//         console.log("successfully connected");
//       });
// }
function createTable(tableName,id,term,description) {
  const db = new DBCommon("./DB.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
        console.log("successfully connected");
    }).get()
    db.run(`CREATE TABLE ${tableName}(${id},${term}${description})`)
}

function insertDataIntoTable(tableName="term",id,term,description) {
  const db = new DBCommon("./db.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
        console.log("successfully connected");
    }).get()
    console.log("IN_DB_POST")
  const sql = `INSERT INTO term(id,term,description) VALUES(?,?,?)`;
  db.run(sql,[id, term, description], (err) => {
    if (err) return console.error("DBERROR",err.message);
  })
}
// insertDataIntoTable("term",5,'test5',"it is test5")
// create table
// db.run('CREATE TABLE term(id,term,description)')

// delete table
// db.run("DROP TABLE term")

//delete object
// function deleteData(id) {
  // sql = `DELETE FROM ${tableName} WHERE id = ?`
  // console.log('gonna delete')
  // db.run(sql,['2'], (err) => {
  //   if(err) return console.error(err.message)
  // })
// }
// const sql = "INSERT INTO term(id, term, description) VALUES(?,?,?)";

// db.run(sql,['1','test1','it is test1'], (err) => {
//     if (err) return console.error(err.message)
//     console.log("new loq created")
// })
const sql_SELECT = "SELECT * FROM term";

function getALLData() {
    const db = new DBCommon("./db.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        console.log("successfully connected");
    }).get()
  return new Promise((resolve, reject) => {
    db.all(sql_SELECT, [], (err, row) => {
      if (err) {
        reject(err);
        closeDB();
      } else {
        console.log("DB", row, row[0]);
        resolve(row);
        closeDB();
      }
    });
  });
  function closeDB() {
    db.close((err) => {
      if (err) return console.error(err.message);
      console.log("DB_CLOSED");
    });
  }
}

module.exports = {
  getALLData,
  insertDataIntoTable,
  // deleteData
};
