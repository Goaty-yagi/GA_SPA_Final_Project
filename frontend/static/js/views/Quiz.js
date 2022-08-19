import AbstractView from "./AbstractView.js";
import twitter from "../../images/twitter.png";

let allQuestion = []
let allTerm = []
const frontURL = "localhost:1234"

class SetQuiz{
    constructor(obj) {
        this.label = obj.definition
        this.answer = obj.term
        this.choices = []
        this.choices.push(obj.term)
        allTerm.push(obj.term)
        allQuestion.push(this)
    }
}

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Quiz")
        this.app = document.querySelector("#app")
        this.quizComponentDom
        this.url = "http://localhost:5000"
        this.path = "/api/quiz/js"
        this.endpoint = this.url + this.path
        this.progress = 0
        this.correctNum = 0
        this.intervalId
        this.apiData
        this.timer
        this.questionWrapper
    }
    async renderHTML() {
        //async return HTML might be asynchronous
        console.log("RENDER HTML")
        return `
        <div class="quiz-dom">
        <div class="start-countdown">3</div>
        </div>
        `
    }
    initialEvent() {
        this.fetchData()
        this.start()
        this.mutationObserver(() => {this.allReset()})
        this.quizComponentDom = document.querySelector(".quiz-dom")
    }
    async start() {
        let startSecond = 3
        await new Promise(() => {
            this.intervalId = setInterval(()=> {
                if(startSecond > 1) {
                    startSecond -= 1
                    this.quizComponentDom.innerHTML = `<div class="start-countdown">${startSecond}</div>`
                } else if(startSecond == 1) {
                    this.quizComponentDom.innerHTML = `<div class="start-countdown-start">START!</div>`
                    startSecond -= 1
                } else {
                    clearInterval(this.intervalId)
                    this.setQuiz()
                    this.quizProgress()
                    this.countdown()
                }
            },1000)
        })
    }
    allReset(){
        this.progress = 0
        this.correctNum = 0
        this.apiData
        this.timer
        allQuestion = []
        allTerm = []
        clearInterval(this.intervalId)
        this.intervalId = ''
        console.log("ALLRESET")
    }
    async fetchData() {
        await fetch(this.endpoint)
        .then(result => {
            return result.json()
        })
        .then(data =>{
            this.apiData = data
        })
    }
     setQuiz() {
        for (let i = 0; i < this.apiData.length; i++) {
            new SetQuiz(this.apiData[i])
        }
        allQuestion.forEach(obj => {
            while (obj.choices.length < 4) {
                let term = allTerm[Math.floor(Math.random() * allTerm.length)]
                obj.choices.push(term)
                obj.choices = this.shaffleArray(Array.from(this.setLength(obj.choices)))
            }
        })
        allQuestion = this.shaffleArray(allQuestion)
    }
    quizProgress() {
        console.log("PROGRESS_START")
        let lebal = allQuestion[this.progress].label;
        let choiceOne = allQuestion[this.progress].choices[0];
        let choiceTwo = allQuestion[this.progress].choices[1];
        let choiceThree = allQuestion[this.progress].choices[2];
        let choiceFour = allQuestion[this.progress].choices[3];
        let questionHTML = `
              <div class="question-wrapper">
              <div class="lable-container">
              <div class="question-num">Q, ${this.progress + 1}</div>
              <label>${lebal}</label>
              </div>
              <button class="each-choice" id="${choiceOne}"><div class="order">1</div><div class="choice">${choiceOne}</div></button>
              <button class="each-choice" id="${choiceTwo}"><div class="order">2</div><div class="choice">${choiceTwo}</div></button>
              <button class="each-choice" id="${choiceThree}"><div class="order">3</div><div class="choice">${choiceThree}</div></button>
              <button class="each-choice" id="${choiceFour}"><div class="order">4</div><div class="choice">${choiceFour}</div></button>
              </div>`;
        this.quizComponentDom.innerHTML = questionHTML;
        let choices = document.querySelectorAll(".each-choice");
        for (let i = 0; i <= 3; i++) {
          choices[i].addEventListener(
            "click",
            (e) => {
              clearInterval(this.intervalId);
              //set style for clicked choice
              choices[i].style.background = "gray"
              choices[i].style.color = "white"
              choices[i].style.border = "solid orange"
              // stop hover
              this.questionWrapper = document.querySelector(".question-wrapper")
              this.questionWrapper.style.pointerEvents = "none"
              
              if (allQuestion[this.progress].answer == e.target.id) {
                this.correctNum += 1;
                this.progress += 1;
                this.quizComponentDom.innerHTML += `<i id="font" class="fab fa-angellist"></i>`;
                if (allQuestion.length == this.progress) {
                  console.log("LAST_QUESTION")
                  // clearInterval(intervalId);
                  this.stop();
                } else {
                  console.log("NEXT_QUESTION")
                  // clearInterval(intervalId);
                  this.intervalId = setTimeout(() => {
                    this.quizProgress(), this.countdown();
                  }, 2000);
                }
              } else {
                console.log("NOT_CORRECT")
                // clearInterval(intervalId);
                this.quizComponentDom.innerHTML += `<i id="font" class="fas fa-times"></i>`;
                this.stop();
              }
            },
            true
          );
        }
      }
    countdown() {
        let startSecond = 10
        this.timer = document.createElement('div')
        this.timer.className = "countdown"
        this.quizComponentDom.prepend(this.timer)
        this.timer.innerHTML = `<div class="base-count-num">${startSecond}</div> <div class="second-left">second left...</div>`
        this.intervalId = setInterval(() => {
              let singularOrPlural = startSecond === 1 + 1? "second" : "seconds";
              let greaterThanThree = startSecond > 3 + 1? "base-count-num" : "last-three";
              if (startSecond > 0) {
                startSecond -= 1;
                this.timer.innerHTML = `<div class=${greaterThanThree}>${startSecond}</div> <div class="second-left">${singularOrPlural} left...</div>`;
              } else {
                clearInterval(this.intervalId);
                this.quizComponentDom.innerHTML += `<i id="font" class="fas fa-times"></i>`;
          
                //stop hover
                this.questionWrapper = document.querySelector(".question-wrapper")
                this.questionWrapper.style.pointerEvents = "none"
                this.stop();
              }
        },1000)
    }
    stop() {
        const message = "Your Score Is ..."
        const resultHTML = `
            <div class="relust-container">
            <div class="score-text">${message}
            <span class="score-num"></span>
            </div>
            </div>
        `
        new Promise((resolve, reject) => {
            this.intervalId = setTimeout(() => {
                this.timer.innerHTML = ''
                this.quizComponentDom.innerHTML = resultHTML
                const score = document.querySelector(".score-num")
                resolve(score)
            },2000)
        }).then((score) => {
            return new Promise((resolve, reject) => {
                this.intervalId = setTimeout(() => {
                    score.innerHTML = `${this.correctNum}`
                    resolve()
                },1000)
            })
        }).then(() => {
            // will be added some functionalities
            this.intervalId = setTimeout(() => {
                const resultContainer = document.querySelector(".relust-container")
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
                `
                resultContainer.innerHTML += `${tweetHTML}`
                document.querySelector(".social-img").addEventListener("click", () => {
                    const shareURL = "https://twitter.com/intent/tweet?text=" + "%23" + "RANKINQUIZ" + "%20%0a" + "Your score is "+ this.correctNum + "%0a" + "&url=" + "%0a" + frontURL;
                    window.open(shareURL)
                })
                document.querySelector(".register-button").addEventListener("click", () => {
                    history.replaceState(null, null, `/signup?score=${this.correctNum}`)
                })
            },1000)
        })
    }
    shaffleArray(array) {
        //Fisher–Yates shuffle
        let length = array.length;

        while (length) {
            let i = Math.floor(Math.random() * length);
            let val = array[--length];
            array[length] = array[i];
            array[i] = val;
        }
        return array
    }
    setLength(array) {
        return new Set(array)
    }
}

export { correctNum }
