import AbstractView from "./AbstractView.js";
import twitter from "../../images/twitter.png";
import { userData } from "../../../../firebase/authentication.js";

const frontURL = "localhost:1234";
const app = document.querySelector("#app");
const url = "http://localhost:5000";
const path = "/api/quiz/js";
const endpoint = url + path;

let progress = 0;
let correctNum = 0;
let intervalId;
let apiData;
let timer;
let allQuestion = [];
let allTerm = [];
let intervalStop = false

fetch(endpoint, {
  method: "GET",
})
  .then(turnResponseIntoJS)
  .then(handleData);

function turnResponseIntoJS(res) {
  return res.json();
}

function handleData(data) {
  apiData = data;
}

class SetQuiz {
  constructor(obj) {
    this.label = obj.definition;
    this.answer = obj.term;
    this.choices = [];
    this.choices.push(obj.term);
    allTerm.push(obj.term);
    allQuestion.push(this);
  }
}
function countdown() {
  let startSecond = 10;
  timer = document.createElement("div");
  timer.className = countdown;
  app.prepend(timer);
  timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`;
  intervalId = setInterval(() => {
    if (startSecond > 0) {
      startSecond -= 1;
      timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`;
    } else {
      clearInterval(intervalId);
      app.innerHTML += `<i id="font" class="fas fa-times"></i>`;
      stop();
    }
  }, 1000);
}

function setQuiz() {
  for (let i = 0; i < apiData.length; i++) {
    new SetQuiz(apiData[i]);
  }
  allQuestion.forEach((obj) => {
    while (obj.choices.length < 4) {
      let term = allTerm[Math.floor(Math.random() * allTerm.length)];
      obj.choices.push(term);
      obj.choices = shaffleArray(Array.from(setLength(obj.choices)));
    }
  });
  allQuestion = shaffleArray(allQuestion);
}

function quizProgress() {
  console.log(
    "PRGRS",
    allQuestion[progress],
    allQuestion[progress].description
  );
  let lebal = allQuestion[progress].label;
  let choiceOne = allQuestion[progress].choices[0];
  let choiceTwo = allQuestion[progress].choices[1];
  let choiceThree = allQuestion[progress].choices[2];
  let choiceFour = allQuestion[progress].choices[3];
  let questionHTML = `
        <div class="question-wrapper">
        <div class="lable-container">
        <div class="question-num">Q, ${progress + 1}</div>
        <label>${lebal}</label>
        </div>
        <div class="each-choice" id="${choiceOne}"><div class="order">1</div><div class="choice">${choiceOne}</div></div>
        <div class="each-choice" id="${choiceTwo}"><div class="order">2</div><div class="choice">${choiceTwo}</div></div>
        <div class="each-choice" id="${choiceThree}"><div class="order">3</div><div class="choice">${choiceThree}</div></div>
        <div class="each-choice" id="${choiceFour}"><div class="order">4</div><div class="choice">${choiceFour}</div></div>
        </div>`;
  app.innerHTML = questionHTML;
  let choices = document.querySelectorAll(".each-choice");
  console.log(allQuestion[progress].answer);
  for (let i = 0; i <= 3; i++) {
    choices[i].addEventListener(
      "click",
      (e) => {
        if (allQuestion[progress].answer == e.target.id) {
          console.log("correct");
          correctNum += 1;
          progress += 1;
          app.innerHTML += `<i id="font" class="fab fa-angellist"></i>`;
          if (allQuestion.length == progress) {
            clearInterval(intervalId);
            stop();
          } else {
            clearInterval(intervalId);
            intervalId = setTimeout(() => {
              quizProgress(), countdown();
            }, 2000);
          }
        } else {
          clearInterval(intervalId);
          app.innerHTML += `<i id="font" class="fas fa-times"></i>`;
          stop();
        }
      },
      true
    );
  }
}

function stop() {
  const message = "Your Score Is ...";
  const resultHTML = `
        <div class="relust-container">
        <div class="score-text">${message}
        <span class="score-num"></span>
        </div>
        </div>
    `;
  new Promise((resolve, reject) => {
    intervalId = setTimeout(() => {
      timer.innerHTML = "";
      app.innerHTML = resultHTML;
      const score = document.querySelector(".score-num");
      resolve(score);
    }, 2000);
  })
    .then((score) => {
      return new Promise((resolve, reject) => {
        intervalId = setTimeout(() => {
          score.innerHTML = `${correctNum}`;
          resolve();
        }, 1000);
      });
    })
    .then(() => {
      //     // will be added some functionalities
      intervalId = setTimeout(() => {
        const resultContainer = document.querySelector(".relust-container");
        const tweetHTML = `
                        <div class="result-footer">
                            <div class="footer-section">
                                <div>Tweet your score</div>
                                <img class="social-img" src="${twitter}">
                            </div>
                            <div class="footer-section">
                                <div>Register? your score sould be in the Ranking!</div>
                                <div class="register-button" data-link>Register</div>
                            </div>
                        </div>
                        `;
        resultContainer.innerHTML += `${tweetHTML}`;
        document.querySelector(".social-img").addEventListener("click", () => {
          const shareURL =
            "https://twitter.com/intent/tweet?text=" +
            "%23" +
            "RANKINQUIZ" +
            "%20%0a" +
            "Your score is " +
            correctNum +
            "%0a" +
            "&url=" +
            "%0a" +
            frontURL;
          window.open(shareURL);
        });
        document
          .querySelector(".register-button")
          .addEventListener("click", () => {
            history.replaceState(
              null,
              null,
              `/signup?score=${correctNum}`
            );
          });
      }, 1000);
    });
}

function setLength(array) {
  return new Set(array);
}

function shaffleArray(array) {
  //Fisher–Yates shuffle
  let length = array.length;

  while (length) {
    let i = Math.floor(Math.random() * length);
    let val = array[--length];
    array[length] = array[i];
    array[i] = val;
  }
  return array;
}

function allReset() {
  progress = 0;
  correctNum = 0;
  intervalId;
  apiData;
  timer;
  allQuestion = [];
  allTerm = [];
  clearInterval();
}

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Quiz");
    console.log("CONST",userData)
  }
  async getHtml() {
    //async return HTML might be asynchronous
    return `
        <div class="start-countdown">3</div>
        `;
  }
  addEvent() {
    this.event().then(() => {
      clearInterval(intervalId);
          setQuiz();
          quizProgress();
          countdown();
    });
    // startCountDown = document.querySelector()
  }
  async event() {
    console.log("EVENT_CLICKED");
    let startSecond = 3;
    await new Promise((resolve, reject) => {
      intervalId = setInterval(() => {
        if (startSecond > 1) {
          startSecond -= 1;
          app.innerHTML = `<div class="start-countdown">${startSecond}</div>`;
        } else if (startSecond == 1) {
          app.innerHTML = `<div class="start-countdown-start">START!</div>`;
          startSecond -= 1;
        } else {
          resolve()
        }
      }, 1000);
    });
  }
  allReset() {
    progress = 0;
    correctNum = 0;
    apiData;
    timer;
    allQuestion = [];
    allTerm = [];
    console.log(intervalId)
    clearInterval(intervalId);
    intervalId = "";
    console.log("ALLRESET");
  }
}

// let allQuestion = []
// let allTerm = []
// const frontURL = "localhost:1234"

// class SetQuiz{
//     constructor(obj) {
//         this.label = obj.definition
//         this.answer = obj.term
//         this.choices = []
//         this.choices.push(obj.term)
//         allTerm.push(obj.term)
//         allQuestion.push(this)
//     }
// }

// export default class extends AbstractView {
//     constructor() {
//         super()
//         this.setTitle("Quiz")
//         this.app = document.querySelector("#app")
//         this.url = "http://localhost:5000"
//         this.path = "/api/quiz/js"
//         this.endpoint = this.url + this.path
//         this.progress = 0
//         this.correctNum = 0
//         this.intervalId
//         this.apiData
//         this.timer
//     }
//     async getHtml() {
//         //async return HTML might be asynchronous
//         return `
//         <div class="start-countdown">3</div>
//         `
//     }
//     addEvent() {
//         this.fetchData()
//         this.event()
//         // startCountDown = document.querySelector()
//     }
//     async event() {
//         let startSecond = 3
//         await new Promise(() => {
//             this.intervalId = setInterval(()=> {
//                 if(startSecond > 1) {
//                     startSecond -= 1
//                     this.app.innerHTML = `<div class="start-countdown">${startSecond}</div>`
//                 } else if(startSecond == 1) {
//                     this.app.innerHTML = `<div class="start-countdown-start">START!</div>`
//                     startSecond -= 1
//                 } else {
//                     clearInterval(this.intervalId)
//                     this.setQuiz()
//                     this.quizProgress()
//                     this.countdown()
//                 }
//             },1000)
//         })
//     }
//     allReset(){
//         this.progress = 0
//         this.correctNum = 0
//         this.apiData
//         this.timer
//         allQuestion = []
//         allTerm = []
//         clearInterval(this.intervalId)
//         this.intervalId = ''
//         console.log("ALLRESET")
//     }
//     async fetchData() {
//         await fetch(this.endpoint)
//         .then(result => {
//             return result.json()
//         })
//         .then(data =>{
//             console.log(data)
//             this.apiData = data
//         })
//     }
//      setQuiz() {
//         for (let i = 0; i < this.apiData.length; i++) {
//             new SetQuiz(this.apiData[i])
//         }
//         allQuestion.forEach(obj => {
//             while (obj.choices.length < 4) {
//                 let term = allTerm[Math.floor(Math.random() * allTerm.length)]
//                 obj.choices.push(term)
//                 obj.choices = this.shaffleArray(Array.from(this.setLength(obj.choices)))
//                 console.log(obj.choices)
//             }
//         })
//         allQuestion = this.shaffleArray(allQuestion)
//     }
//     quizProgress() {
//         let lebal = allQuestion[this.progress].label
//         let choiceOne = allQuestion[this.progress].choices[0]
//         let choiceTwo = allQuestion[this.progress].choices[1]
//         let choiceThree = allQuestion[this.progress].choices[2]
//         let choiceFour = allQuestion[this.progress].choices[3]
//         let questionHTML = `
//             <div class="question-wrapper">
//             <div class="lable-container">
//             <div class="question-num">Q, ${this.progress + 1}</div>
//             <label>${lebal}</label>
//             </div>
//             <div class="each-choice" id="${choiceOne}"><div class="order">1</div><div class="choice">${choiceOne}</div></div>
//             <div class="each-choice" id="${choiceTwo}"><div class="order">2</div><div class="choice">${choiceTwo}</div></div>
//             <div class="each-choice" id="${choiceThree}"><div class="order">3</div><div class="choice">${choiceThree}</div></div>
//             <div class="each-choice" id="${choiceFour}"><div class="order">4</div><div class="choice">${choiceFour}</div></div>
//             </div>`
//         this.app.innerHTML = questionHTML
//         let choices = document.querySelectorAll(".each-choice")
//         for (let i = 0; i <= 3; i++) {
//             choices[i].addEventListener('click', ((e) => {
//                 if(allQuestion[this.progress].answer == e.target.id) {
//                     console.log("correct")
//                     this.correctNum += 1
//                     this.progress += 1
//                     this.app.innerHTML += `<i id="font" class="fab fa-angellist"></i>`
//                     if(allQuestion.length == this.progress) {
//                         clearInterval(this.intervalId)
//                         this.stop()
//                     } else {
//                         clearInterval(this.intervalId)
//                         this.intervalId = setTimeout(() => {
//                             this.quizProgress(),
//                             this.countdown()
//                         },2000)
//                     }
//                 } else {
//                     clearInterval(this.intervalId)
//                     this.app.innerHTML += `<i id="font" class="fas fa-times"></i>`
//                     this.stop()
//                 }
//             }),true)
//         }
//     }
//     countdown() {
//         let startSecond = 10
//         this.timer = document.createElement('div')
//         this.timer.className = this.countdown
//         this.app.prepend(this.timer)
//         this.timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`
//         this.intervalId = setInterval(()=> {
//             if(startSecond > 0) {
//                 startSecond -= 1
//                 this.timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`
//             } else {
//                 clearInterval(this.intervalId)
//                 this.app.innerHTML += `<i id="font" class="fas fa-times"></i>`
//                 this.stop()
//             }
//         },1000)
//     }
//     stop() {
//         const message = "Your Score Is ..."
//         const resultHTML = `
//             <div class="relust-container">
//             <div class="score-text">${message}
//             <span class="score-num"></span>
//             </div>
//             </div>
//         `
//         new Promise((resolve, reject) => {
//             this.intervalId = setTimeout(() => {
//                 this.timer.innerHTML = ''
//                 this.app.innerHTML = resultHTML
//                 const score = document.querySelector(".score-num")
//                 resolve(score)
//             },2000)
//         }).then((score) => {
//             return new Promise((resolve, reject) => {
//                 this.intervalId = setTimeout(() => {
//                     score.innerHTML = `${this.correctNum}`
//                     resolve()
//                 },1000)
//             })
//         }).then(() => {
//             // will be added some functionalities
//             this.intervalId = setTimeout(() => {
//                 const resultContainer = document.querySelector(".relust-container")
//                 const tweetHTML = `
//                 <div class="result-footer">
//                     <div class="footer-section">
//                         <div>Tweet your score</div>
//                         <img class="social-img" src="${twitter}">
//                     </div>
//                     <div class="footer-section">
//                         <div>Register? your score sould be in the Ranking!</div>
//                         <div class="register-button" data-link>Register</div>
//                     </div>
//                 </div>
//                 `
//                 resultContainer.innerHTML += `${tweetHTML}`
//                 document.querySelector(".social-img").addEventListener("click", () => {
//                     const shareURL = "https://twitter.com/intent/tweet?text=" + "%23" + "RANKINQUIZ" + "%20%0a" + "Your score is "+ this.correctNum + "%0a" + "&url=" + "%0a" + frontURL;
//                     window.open(shareURL)
//                 })
//                 document.querySelector(".register-button").addEventListener("click", () => {
//                     history.replaceState(null, null, `/signup?score=${this.correctNum}`)
//                 })
//             },1000)
//         })
//     }
//     shaffleArray(array) {
//         //Fisher–Yates shuffle
//         let length = array.length;

//         while (length) {
//             let i = Math.floor(Math.random() * length);
//             let val = array[--length];
//             array[length] = array[i];
//             array[i] = val;
//         }
//         return array
//     }
//     setLength(array) {
//         return new Set(array)
//     }
// }

// export { correctNum }
