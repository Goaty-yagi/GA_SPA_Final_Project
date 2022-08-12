import AbstractView from "./AbstractView.js";
// import returnVal from "./glossary.js";

// let terms = returnVal()
// console.log(terms[0])
// terms.forEach(e => {
//     fetch('http://localhost:5000/api/quiz/js',{
//             method:"POST",
//             body: JSON.stringify({
//                 term: e.term,
//                 class: e.class,
//                 definition: e.definition,
//                 tags: e.tags
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
// })

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Create")
        this.questions
    }
    async getHtml() {
        //async return HTML might be asynchronous
        return `
        <h1 class="title">CREATE QUESTION</h1>
        <section class="create-section">
        <form onsubmit="return false" id="form">
            <div>
                <div>TERM</div>
                <input class="text-input" type="text" name="text" aria-label="term" value="">
                <div>Description</div>
                <input class="text-input" type="text" name="text" aria-label="description" value="">
                <button class="submit-button" aria-label="submit">CREATE</button>
            </div>
            </form>
            <h1 class="check">Check All Questions?</h1>
            <div class="all-question"></div>
        </section>
        `
    }
    addEvent() {
        document.querySelector(".submit-button").addEventListener("click",() => {
            this.createEvent()
        })
        document.querySelector(".check").addEventListener("click",this.allQuestion())
    }
    async createEvent() {
        const inputValues = document.querySelectorAll(".text-input")
        console.log(inputValues,inputValues[1].value)
        const user = await fetch('http://localhost:5000/api/',{
            method:"POST",
            body: JSON.stringify({
                term: inputValues[0].value,
                description: inputValues[1].value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log("user",user)
    }
    async allQuestion() {
        await 
        fetch('http://localhost:5000/api/')
        .then(response => response.json())
        .then(data => this.questions = data)
        const targetElement = document.querySelector(".all-question")
        targetElement.style.border = "solid black"
        targetElement.style.height = "400px" 
        targetElement.style.overflow =  "scroll"       
        this.questions.forEach(e => {
            targetElement.innerHTML += `
            <div class="all-container">
                <div class="term-question">
                    <div class"title-question">TERM</div>
                    <div class"value-question">${e.term}</div>
                </div>
                <div class="term-question">
                    <div class"title-question">Description</div>
                    <div class"value-question">${e.description}</div>
                </div>
                <button class="delete" id="${e.id}">DELETE</button>
            </div>    
            `
        })
        const deleteElement = document.querySelectorAll(".delete")
        deleteElement.forEach(each => {
            each.addEventListener("click", (e) => {
                this.deleteEvent(e.target.id)
            })
        })
    }
    async deleteEvent(id) {
        console.log(id)
        await fetch(`http://localhost:5000/api/${id}`,{
            method:"DELETE",
        })
    }
}