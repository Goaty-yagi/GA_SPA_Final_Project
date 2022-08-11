const express = require("express");
const path = require("path");
const cors = require("cors")
const {
  createTable,
  insertDataIntoTable,
  getALLData,
  patchData,
  deleteData,
} = require("./database/database");
// const { createUser, login } = require("./firebase/authentication");
// const auth = require("./firebase/config");

const port = process.env.PORT || 5000;
const app = express();

// middleware 
app.use(express.json());

// read static file
app.use(cors())
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static")),
);

// API
app.get("/api", (req, res) => {
  console.log("API2", req.url);
  getALLData(req, res);
});

app.post("/api", async (req, res) => {
  insertDataIntoTable(req.body, res);
});

app.patch("/api/:id", (req, res) => {
  console.log("patch");
  patchData(req, res);
});

app.delete("/api/:id", (req, res) => {
  console.log("delete");
  deleteData(req, res);
});

// firebase
// app.post("/firebase", async (req, res) => {
//   createUser(req, res);
// });

// app.post("/login", async (req, res) => {
//   console.log("login")
//   login(req, res)
// });


// HTTP render
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("frontend", "index.html")); //like FS
  console.log("API", req.url);
});

app.listen(port, () => console.log("server is listenning"));
