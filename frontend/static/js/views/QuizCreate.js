import AbstractView from "./AbstractView.js";
import Study from "./Study.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Create")
        this.createSection
        this.questions
        this.selecterWindowContainer
        this.createButton
        this.chosenTags = []
        this.formError = []
        this.windowIsOpen = false
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
        <div class="create-header">
        <p class="create-header-menu">Create</p>
        <p class="create-header-menu">AllQuestions</p>
        </div>
        <section class="create-section">
        <h1 class="title">CREATE QUESTION</h1>
        <form class="create-form" onsubmit="return false" id="form">
            <div>TERM</div>
            <input class="text-input" type="text" name="text" aria-label="term" value="">
            <div>Description</div>
            <input class="text-input" type="text" name="text" aria-label="description" value="">
            <div>CLASS</div>
            <input class="text-input" type="number" min="1" max="8" name="number" aria-label="class" value="">
            <div class="create-select-text">
                <div>TAGS</div>
                <div class="selecter-box">Choose tags <i class="fas fa-angle-down"></i></div>
                <div class="selecter-window-container"></div>
                <div class="select-chosen"></div>
            </div>
            <div class="create-button-container">
            <button class="create-submit-button"  aria-label="submit">CREATE</button>
            </div>
        </form>
        </section>
        `
    }
    initialEvent() {
        app.style.display = "initial";
        this.selecterWindowContainer = document.querySelector(".selecter-window-container")
        this.createSection = document.querySelector(".create-section")
        this.createButton = document.querySelector(".create-submit-button")
        this.createButton.addEventListener("click",() => {
            this.createEvent()
        })
        const headerMenues = document.querySelectorAll(".create-header-menu");
        for (let i = 0; i < headerMenues.length; i++) {
            headerMenues[i].addEventListener(
            "click",
            (e) => { this.boardControle(e)})
        }
        // document.querySelector(".check").addEventListener("click",() => this.allQuestion())
        this._selectorEvent()

    }
    _selectorEvent() {
        const selecterBox = document.querySelector(".selecter-box")
        // const this.selecterWindowContainer = document.querySelector(".selecter-window-container")
        const selecterWindow = document.createElement("div")
        selecterWindow.className = "select-window"
        selecterBox.addEventListener("click",() => {
            if(!this.windowIsOpen) {
                for(let i = 0; i < this.tagsArray.length; i ++) {
                    let tagChild = document.createElement("div")
                    tagChild.innerHTML = `${this.tagsArray[i]}`
                    selecterWindow.appendChild(tagChild)
                    tagChild.addEventListener('click', chosenEvent)
                    this.selecterWindowContainer.append(selecterWindow)
                    this.windowIsOpen = true         
                }
            } else {
                this.selecterWindowContainer.innerHTML = ""
                this.windowIsOpen = false
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
                    this.windowIsOpen = false
                    this.selecterWindowContainer.innerHTML = ""
                }
            } else {
                this.chosenTags.push(chosenTag)
                selectChosen.innerHTML += `<div class="chosen-tag ${chosenTag}">${chosenTag}</div>`
                this.windowIsOpen = false
                this.selecterWindowContainer.innerHTML = ""
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
            this.createButton.setAttribute("disabled", true)
            const errorTitle = `<div class="error-title">ERROR OCCURRED</div>`
            const errorSection = document.createElement("div")
            errorSection.className = "error-section"
            errorSection.innerHTML += errorTitle
            this.formError.forEach(err => {
                errorSection.innerHTML += `<li class="each-error">${err}</li>`
            })
            this.createSection.append(errorSection)
            setTimeout(() => {
                this.createSection.removeChild(errorSection)
                this.createButton.disabled = false
            }, 4000)
        }
        this.formError = []
    }

    async allQuestions() {
        console.log("clocked")
        const study = new Study()
        this.createSection.innerHTML = await study.renderHTML()
        study.initialEvent()
    }
    async deleteEvent(id) {
        console.log(id)
        await fetch(`http://localhost:5000/api/${id}`,{
            method:"DELETE",
        })
    }
    boardControle(e) {
        if(e.target.innerHTML === "AllQuestions") {
            this.allQuestions()
        }
        console.log(e.target.innerHTML)
    }
}