import AbstractView from "./AbstractView.js";
import Study from "./Study.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Create")
        this.createSection
        this.questions
        this.chosenTags = []
        this.formError = []
        // this.formError = {
        //     term : "",
        //     description : "",
        //     class : "",
        //     tags : ""
        // }
        this.tagsArray = [
            "General",
            "Git",
            "GitHub",
            "Internet",
            "Node",
            "Protocol",
            "HTTP",
            "Front-End",
            "Programming",
            "JavaScript",
            "Browser",
            "DOM",
            "Higher-Order Functions",
            "Events",
            "Functional"
        ]
    }
    async renderHTML() {
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
                <div>CLASS</div>
                <input class="text-input" type="number" min="1" max="8" name="number" aria-label="class" value="">
                <div class="create-select-text">
                    <div>TAGS</div>
                    <div class="selecter-box">Choose tags</div>
                    <div class="selecter-window"></div>
                    <div class="select-chosen"></div>
                </div>
                <button class="submit-button" aria-label="submit">CREATE</button>
            </div>
        </form>
        <h1 class="check">Check All Questions?</h1>
        <div class="all-question"></div>
        </section>
        `
    }
    initialEvent() {
        this.createSection = document.querySelector(".create-section")
        document.querySelector(".submit-button").addEventListener("click",() => {
            this.createEvent()
        })
        document.querySelector(".check").addEventListener("click",() => this.allQuestion())
        this._selectorEvent()

    }
    _selectorEvent() {
        const selecterBox = document.querySelector(".selecter-box")
        const selecterWindow = document.querySelector(".selecter-window")
        let isOpen = false
        selecterBox.addEventListener("click",() => {
            if(!isOpen) {
                for(let i = 0; i < this.tagsArray.length; i ++) {
                    let tagChild = document.createElement("div")
                    tagChild.innerHTML = `${this.tagsArray[i]}`
                    selecterWindow.appendChild(tagChild)
                    tagChild.addEventListener('click', chosenEvent) 
                    isOpen = true         
                }
            } else {
                selecterWindow.innerHTML = ""
                isOpen = false
            }   
        })

        const chosenEvent = (e) => {
            const currentChosenTagsLength = this.chosenTags.length
            const chosenTag = e.target.innerHTML
            const selectChosen = document.querySelector(".select-chosen")
            if(this.chosenTags.includes(chosenTag)) {
                //delete
                this.chosenTags = this.chosenTags.filter(tag => {
                    // tag.match(`/${chosenTag}/`) === null
                    return tag !== chosenTag
                })
                for(let i = 0; i < selectChosen.children.length; i ++) {
                    if(selectChosen.children[i].innerHTML === chosenTag) {
                        const child = document.querySelector(`.${chosenTag}`)
                        selectChosen.removeChild(child)
                    }
                }
            } else {
                this.chosenTags.push(chosenTag)
                selectChosen.innerHTML += `<div class="chosen-tag ${chosenTag}">${chosenTag}</div>`
                // console.log("SWITCH", currentChosenTagsLength)
                // switch (true) {
                //     case currentChosenTagsLength === 0 ||
                //         currentChosenTagsLength === 1 ||
                //         currentChosenTagsLength === 2:
                //         console.log("CASE-1")
                //         chosenTags.push(chosenTag)
                //         selectChosen.innerHTML += `<div class="chosen-tag ${chosenTag}">${chosenTag}</div>`
                //     case currentChosenTagsLength === 3:
                //         // full
                // }
            }
        }

    }
    _checkForm(inputValues) {

        for(let i = 0; i < inputValues.length; i++) {
            if(!inputValues[i].value) {
                this.formError.push(`${inputValues[i].ariaLabel} is empty.` )
            }
        }
        if(!this.chosenTags.length){
            this.formError.push(`tag is empty.` )
        }
        if(this.formError.length) {
            return false
        } else {
            return true
        }
    }
    async createEvent() {
        const inputValues = document.querySelectorAll(".text-input")
        const formCheck = this. _checkForm(inputValues)
        const url = "http://localhost:5000";
        const path = "/api/quiz/js";
        const endpoint = url + path;
        if(formCheck) {
            const term = inputValues[0].value
            const description = inputValues[1].value
            const classNum = inputValues[2].value
            const tags = this.chosenTags.join()
            debugger
            await fetch(endpoint,{
                method:"POST",
                body: JSON.stringify({
                    term: term,
                    class: classNum,
                    description: description,
                    tags : tags
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(r => console.log("result", r))
        } else {
            const errorSection = document.createElement("div")
            errorSection.className = "error-section"
            this.formError.forEach(err => {
                errorSection.innerHTML += `<div class="each-error">${err}</div>`
            })
            this.createSection.append(errorSection)
        }
        this.formError = []
    }
    async allQuestion() {
        console.log("clocked")
        const study = new Study()
        document.querySelector("#app").innerHTML += await study.renderHTML()
        study.initialEvent()
        // await 
        // fetch(endpoint)
        // .then(response => response.json())
        // .then(data => this.questions = data)
        // const targetElement = document.querySelector(".all-question")
        // targetElement.style.border = "solid black"
        // targetElement.style.height = "400px" 
        // targetElement.style.overflow =  "scroll"       
        // this.questions.forEach(e => {
        //     targetElement.innerHTML += `
        //     <div class="all-container">
        //         <div class="term-question">
        //             <div class"title-question">TERM</div>
        //             <div class"value-question">${e.term}</div>
        //         </div>
        //         <div class="term-question">
        //             <div class"title-question">Description</div>
        //             <div class"value-question">${e.description}</div>
        //         </div>
        //         <button class="delete" id="${e.id}">DELETE</button>
        //     </div>    
        //     `
        // })
        // const deleteElement = document.querySelectorAll(".delete")
        // deleteElement.forEach(each => {
        //     each.addEventListener("click", (e) => {
        //         this.deleteEvent(e.target.id)
        //     })
        // })
    }
    async deleteEvent(id) {
        console.log(id)
        await fetch(`http://localhost:5000/api/${id}`,{
            method:"DELETE",
        })
    }
}