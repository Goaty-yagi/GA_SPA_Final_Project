const express = require("express");
const path = require("path");
const cors = require("cors")
const {
  createTable,
  insertDataIntoTable,
  getALLData,
  patchData,
  deleteData,
  deleteTable
} = require("./database/database");
const { 
  createUserTable, 
  getUserList, 
  patchUserData, 
  deleteUser,
  getUserById
} = require("./database/apis/user");
const { createJsQuizTable, getJsQuizList, deleteJsQuiz, patchJsQuizData } = require("./database/apis/quizzes/js");
const { getScoreList, createScoreTable, deleteScore, patchScoreData, getScoreOrderList, getScoreById } = require("./database/apis/score");
// const { createUser, login } = require("./firebase/authentication");
// const auth = require("./firebase/config");

const port = process.env.PORT || 5000;
const app = express();


// app.use((req, res, next) => {
//   console.log("middle", req.params, req.path, req)
// })
// middleware 
app.use(express.json());

// read static file
app.use(cors())
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static")),
);

// API
// app.get("/api", (req, res) => {
//   console.log("API2", req.url);
//   getALLData(req, res);
// });

// app.post("/api", async (req, res) => {
//   createTable(req, res)
//   // insertDataIntoTable(req.body, res);
// });

// app.patch("/api/:id", (req, res) => {
//   console.log("patch");
//   patchData(req, res);
// });

// app.delete("/api/:id", (req, res) => {
//   console.log("delete");
//   deleteData(req, res);
// });


//@ USER API
app.get("/api/user", (req, res) => {
  console.log("API-=user");
  // deleteTable("users", res)
  getUserList(req, res)
});

app.post("/api/user", (req, res) => {
  console.log("API2-=user");
  createUserTable(req, res)
});

app.delete("/api/user", (req, res) => {
  console.log("delete");
  deleteUser(req, res);
});

app.patch("/api/user", (req, res) => {
  console.log("patch for user");
  // deleteTable("user")
  patchUserData(req, res)
});

app.get("/api/user-id/:id", (req, res) => {
  console.log("API-=user");
  getUserById(req, res)
  // deleteTable("users", res)
  // getUserList(req, res)
});


//@js_quiz API

app.get("/api/quiz/js", (req, res) => {
  console.log("jsquiz");
  // deleteTable("users", res)
  // createUserTable(req, res)
  getJsQuizList(req, res)
});

app.post("/api/quiz/js", (req, res) => {
  console.log("jsquiz");
  // deleteTable("user")
  createJsQuizTable(req, res)
});

app.delete("/api/quiz/js", (req, res) => {
  console.log("delete");
  deleteJsQuiz(req, res)
});

app.patch("/api/quiz/js", (req, res) => {
  // deleteTable("user")
  patchJsQuizData(req, res)
});

//@Score API

app.get("/api/score/:type", (req, res) => {
  console.log("SCORE");
  // deleteTable("scores", res)
  // getScoreList(req, res)
  getScoreOrderList(req, res)
});

app.post("/api/score", (req, res) => {
  console.log("SCORE");
  // deleteTable("user")
  createScoreTable(req, res)
});

app.delete("/api/score", (req, res) => {
  console.log("delete");
  deleteScore(req, res)
});

app.patch("/api/score", (req, res) => {
  console.log("SCORE_PATCH")
  // deleteTable("user")
  patchScoreData(req, res)
});

app.get("/api/score-id/:id", (req, res) => {
  console.log("SCORE_ID");
  // deleteTable("scores", res)
  // getScoreList(req, res)
  getScoreById(req, res)
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
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve("frontend", "index.html")); //like FS
//   console.log("API", req.url);
// });

app.listen(port, () => console.log("server is listenning"));
