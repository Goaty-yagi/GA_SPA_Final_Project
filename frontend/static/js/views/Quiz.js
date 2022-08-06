import AbstractView from "./AbstractView.js";

const app = document.querySelector("#app")
let progress = 0
let correctNum = 0
let intervalId
let apiData
let timer
let allQuestion = []
let allTerm = []


fetch('http://localhost:5200/api/javascript')
.then(turnResponseIntoJS).then(handleData)

function turnResponseIntoJS(res) {
    return res.json();
}

function handleData(data) {
    console.log(data)
    apiData = data
}

class SetQuiz{
    constructor(obj) {
        this.label = obj.description
        this.answer = obj.term
        this.choices = []
        this.choices.push(obj.term)
        allTerm.push(obj.term)
        allQuestion.push(this)
    }
}
function countdown() {
    let startSecond = 10
    timer = document.createElement('div')
    timer.className = countdown
    app.prepend(timer)
    timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`
    intervalId = setInterval(()=> {
        if(startSecond > 0) {
            startSecond -= 1
            timer.innerHTML = `<div class="countdown-num">${startSecond}</div> <div class="second-left">second left...</div>`
        } else {
            clearInterval(intervalId)
            app.innerHTML += `<i id="font" class="fas fa-times"></i>`
            stop()
        }
    },1000)
}

function setQuiz() {
    for (let i = 0; i < apiData.length; i++) {
        new SetQuiz(apiData[i])
    }
    console.log(allQuestion,allTerm)
    allQuestion.forEach(obj => {
        while (obj.choices.length < 4) {
            let term = allTerm[Math.floor(Math.random() * allTerm.length)]
            obj.choices.push(term)
            obj.choices = shaffleArray(Array.from(setLength(obj.choices)))
            console.log(obj.choices)
        }
    })
    allQuestion = shaffleArray(allQuestion)
}


function quizProgress() {
    let lebal = allQuestion[progress].label
    let choiceOne = allQuestion[progress].choices[0]
    let choiceTwo = allQuestion[progress].choices[1]
    let choiceThree = allQuestion[progress].choices[2]
    let choiceFour = allQuestion[progress].choices[3]
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
        </div>`
    app.innerHTML = questionHTML
    let choices = document.querySelectorAll(".each-choice")
    console.log(allQuestion[progress].answer)
    for (let i = 0; i <= 3; i++) {
        choices[i].addEventListener('click', ((e) => {
            if(allQuestion[progress].answer == e.target.id) {
                console.log("correct")
                correctNum += 1
                progress += 1
                app.innerHTML += `<i id="font" class="fab fa-angellist"></i>`
                if(allQuestion.length == progress) {
                    clearInterval(intervalId)
                    stop()
                } else {
                    clearInterval(intervalId)
                    intervalId = setTimeout(() => {
                        quizProgress(),
                        countdown()
                    },2000)
                }
            } else {
                clearInterval(intervalId)
                app.innerHTML += `<i id="font" class="fas fa-times"></i>`
                stop()
            }
        }),true)
    }
}

function stop() {
    const message = "Your Score Is ..."
    const resultHTML = `
        <div class="relust-container">
        <div class="score-text">${message}
        <span class="score-num"></span>
        </div>
        </div>
    `
    new Promise((resolve, reject) => { 
        intervalId = setTimeout(() => {
            timer.innerHTML = ''
            app.innerHTML = resultHTML
            const score = document.querySelector(".score-num")
            resolve(score)
        },2000)
    }).then((score) => {
        return new Promise((resolve, reject) => {
            intervalId = setTimeout(() => {
                score.innerHTML = `${correctNum}` 
                resolve()
            },1000)
        })
    }).then(() => {
        // will be added some functionalities
        intervalId = setTimeout(() => {
            const resultContainer = document.querySelector(".relust-container")
            console.log(resultContainer)
            const tweetHTML = `
                <div>will be added</div>
                `
            const registerHTML = `
                <div>will be added</div>
                `
            resultContainer.innerHTML += `${tweetHTML}` 
            resultContainer.innerHTML += `${registerHTML}`
        },1000)
    })
}

function setLength(array) {
    return new Set(array)
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
    return array
}

function allReset() {
    progress = 0
    correctNum = 0
    intervalId
    apiData
    timer
    allQuestion = []
    allTerm = []
    // intervalAndTimeOutIds = []
    clearInterval()
}

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Quiz")
    }
    async getHtml() {
        //async return HTML might be asynchronous
        return `
        <div class="start-countdown">3</div>
        `
    }
    addEvent() {
        this.event()
        // startCountDown = document.querySelector()
    }
    async event() {
        console.log("EVENT_CLICKED")
        let startSecond = 3
        await new Promise(() => {
            intervalId = setInterval(()=> {
                if(startSecond > 1) {
                    startSecond -= 1
                    app.innerHTML = `<div class="start-countdown">${startSecond}</div>`
                } else if(startSecond == 1) {
                    app.innerHTML = `<div class="start-countdown-start">START!</div>`
                    startSecond -= 1
                } else {
                    clearInterval(intervalId)
                    setQuiz()
                    quizProgress()
                    countdown()
    
                }
            },1000)
        })
    }
    allReset(){
        progress = 0
        correctNum = 0
        apiData
        timer
        allQuestion = []
        allTerm = []
        clearInterval(intervalId)
        intervalId = ''
        console.log("ALLRESET")
    }
}
