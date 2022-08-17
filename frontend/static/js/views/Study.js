
import AbstractView from "./AbstractView.js";


const url = "http://localhost:5000";
const path = "/api/quiz/js";
const endpoint = url + path;
let apiData



let tags
let currentDataExist = false
let currentDom = []
let currentData = {
    text:'',
    class:'',
    tags:[]
}
let keysArray
let container
let num
let text

let options


function firstSearch(e){
    let arrayForResult = []
    let set = new Set()
    let gs = apiData

    function textSearch(value,array=[]){
        if(array.length) {
            gs = array
            console.log('text-gs override',value,gs,set)
        }
        for(let i =0; i <= gs.length-1; i++) {
            Object.values(gs[i]).forEach(elem => {
                if(Array.isArray(elem)) {
                    elem.forEach(e => {
                        if(e.toLowerCase().indexOf(value.toLowerCase())!== -1) {
                            set.add(gs[i])
                        }
                    })
                } else if (typeof elem != 'number'){
                    if(elem.toLowerCase().indexOf(value.toLowerCase())!== -1) {
                        set.add(gs[i])
                    }
                } else {
                    if(elem == value) {
                        set.add(gs[i])
                    }
                }
            })
        }
        console.log('text-before-result',set)
        currentData.text = value
        return Array.from(set)
    }

    function classSearch(value,array=[]){
        if(value) {
            if(array.length){
                gs = array
                console.log('value',value,'array-override-in-classsearch',gs)
            }
            for(let i =0; i <= gs.length-1; i++) {
                if(gs[i].class == value) {
                    set.add(gs[i])
                }
            }
            currentData.class = value
            return Array.from(set)
        } else {
            checkCurrentItem()
        }
    } 
    
    function tagSearch() {
        for(let i =0; i <= gs.length-1; i++) {
            Object.keys(gs[i]).forEach(elem => {
                if(elem === "tags") {
                    console.log("CHECK_TAG",gs[i].tags)
                    let tagArray = tagsStringToArray(gs[i])
                    tagArray.forEach(e => {
                        currentData.tags.forEach(t => {
                            if(e.indexOf(t)!== -1) {
                                set.add(gs[i])
                            }
                        })
                    })
                } 
            })
        }
        return  Array.from(set)
    }

    function centerSearch(event) {
        let baseArrayForSearch= []
        let textEmpty = false //for bag solution
        
        if(event.target.type =='text'){
            currentData.text = event.target.value
        }
        else if (event.target.type == 'select-one'){
            currentData.class = event.target.value
        }
        else if (event.target.type == 'checkbox'){
            if(event.target.checked) {
                currentData.tags.push(event.target.id)
            } else {
                currentData.tags.forEach(e => {
                    if(e == event.target.id) {
                        currentData.tags = currentData.tags.filter(t => t!=e)
                    }
                })
            }
        }
        if(currentData.tags.length) {
            baseArrayForSearch = tagSearch()
        }
        else if(currentData.class) {
            baseArrayForSearch = classSearch(currentData.class)
        }
        if(currentData.tags.length) {
            Object.keys(currentData).forEach(key => {
                set = new Set()
                if(key == 'class') {
                    if(currentData.class) {
                        baseArrayForSearch = classSearch(currentData.class,array=baseArrayForSearch)
                    }
                }
                else if(key == 'text') {
                    if(currentData.text) {
                        console.log('gonne textcheck in center')
                        baseArrayForSearch = textSearch(currentData.text,array=baseArrayForSearch)
                        console.log('after textcheck in center',baseArrayForSearch)
                        // bag occur here
                        // whenever class and tags selected, then put text.
                        // when textSearch return empty array, baseArrayForSearch will have objects 
                        // before set
                        // below is solution
                        if(!baseArrayForSearch.length) {
                            textEmpty = true
                        }
                    }
                }
            })            
        } 
        else {
            if(!baseArrayForSearch.length){
                baseArrayForSearch = apiData
            }
            set = new Set()
            baseArrayForSearch = textSearch(currentData.text,array=baseArrayForSearch)
        }
        if(textEmpty){
            baseArrayForSearch = []
        }
        console.log('before set in center',baseArrayForSearch)
        set = new Set(baseArrayForSearch)
        console.log('center-before-return',set)
        return Array.from(set)
    }
    console.log('first action start')
    if(e.target.type=="checkbox") {
        let index = currentData.tags.indexOf(e.target.id)
        if(currentDataExist){
            if(currentData.tags.length&&!currentData.text&&!currentData.class) {
                if(e.target.checked){
                    currentData.tags.push(e.target.id)
                    arrayForResult = tagSearch(e)
                } else {
                    if(currentData.tags.length==1){
                        currentData.tags = []
                        remove(e.target)
                    }
                    else{
                        currentData.tags.splice(index,1)
                        arrayForResult =tagSearch(e)
                    }
                }
            } else {
                arrayForResult = centerSearch(e)
            }
        } else {
            currentData.tags.push(e.target.id)
            arrayForResult = tagSearch(e)
        }
    }
    else if(e.target.type == 'select-one') {
        if(currentDataExist) {
            if(currentData.class&&!currentData.text&&!currentData.tags.length) {
                if(e.target.value) {
                    arrayForResult = classSearch(e.target.value)
                } else {
                    remove(e.target)
                }
            } else {
                arrayForResult = centerSearch(e)
            }
        } else {
            arrayForResult = classSearch(e.target.value)
        }
    } 
    else if(e.target.type == 'text') {
        if(currentDataExist) {
            console.log('CE')
            if(currentData.text&&!currentData.class&&!currentData.tags.length) {
                console.log('only-text exist')
                if(e.target.value) {
                    arrayForResult = textSearch(e.target.value)
                } else {
                    remove(e.target)
                }
            } else {
                console.log('many exist')
                arrayForResult = centerSearch(e)
            }
        } else {
            console.log('white')
            arrayForResult = textSearch(e.target.value)
        }
    }
    console.log("before-result",arrayForResult)
    result(arrayForResult)
}


function checkCurrentItem() {
    let counter = 0
    Object.values(currentData).forEach(elem => {
        if(Array.isArray(elem)) {
            if(elem.length) {
                currentDataExist = true
                counter += 1
            }
        } else {
            if(elem) {
                currentDataExist = true
                counter += 1
            }
        }
    })
    if(counter==0){
        currentDataExist = false
        num.innerHTML = ''
    } else {
        if(!currentDom.length) {
            num.innerHTML = `<div aria-live="polite" class="no-num">no terms found</div>`
        }
    }
    counter = 0
}

function result(results) {
    console.log('in_result',results,container)
    container.innerHTML = ''
    currentDom = []
    num.innerHTML = `<div class="is-loading-bar"><div class="lds-dual-ring"></div></div>`
    setTimeout(resultFun,200)
    function resultFun(){
        if(results.length){
            num.innerHTML = `<div aria-live="polite" class="num">${results.length} terms found</div>`
            results.forEach(result => {
                currentDom.push(result)
                container.innerHTML += '<div aria-live="polite" class="each-item"></div>'
                let each = document.querySelectorAll(".each-item")
                keysArray.forEach(e => {
                    if(e !== "tags"){
                        each[each.length-1].innerHTML += `<div class="category"><p class="title">${e}:</p>
                        <p class="value">${result[e]}</p></div>`
                    } else {
                        each[each.length-1].innerHTML += `<div class="category"><p class="title">${e}:</p>
                        <div class="tags"></div></div>`
                        tags = document.querySelectorAll(".tags")
                        let tagsArray = tagsStringToArray(result)
                        tagsArray.forEach(t=> {
                            tags[tags.length-1].innerHTML += `<tag>${t}</tag>`
                        })
                    }
                })
            })
        } else {
            console.log('all-REMOVE')
            remove()
        }
        checkCurrentItem()
        console.log('result-end')
    }
}

function remove(target) {
    let allItems = document.querySelectorAll(".eachItem")
    const allRemove = () => {
        container.innerHTML = ''
        currentDom = []
    }
    if(!target) {
        allRemove()
    } else {
        if(target.type=='text'){
            if(!target.value){
                allRemove()
            } else {
                for(let i = 0; i < allItems.length; i++) {
                    for(let k = 0; k < allItems[i].children.length; k++){
                        if(allItems[i].children[k].textContent.toLowerCase().includes(currentData.text)){
                            allItems[i].remove()
                            currentDom.splice(i)
                        }
                    }
                }
            }
            currentData.text = ''
        }
        else if(target.type=='select-one'){
            if(!target.value){
                allRemove()
            } else {
                console.log('select')
                for(let i = 0; i < allItems.length; i++) {
                    if(allItems[i].children[1].textContent==currentData.class) {
                        allItems[i].remove()
                        currentDom.splice(i)
                    }
                }
            }
            currentData.class = ''
        }
        else if(target.type=='checkbox') {
            for(let i = 0; i < allItems.length; i++) {
                if(allItems[i].children[3].innerHTML.includes(target.id)) {
                    allItems[i].remove()
                    currentDom.splice(i)
                }
            }
        }
        checkCurrentItem()
    }
}




// for initial dom purpose
function getSelectOption() {
    console.log("get_INITIAL")
    let set = new Set()
    for(let i =0; i <= apiData.length-1; i++) {
        let tagsArray = tagsStringToArray(apiData[i])
        tagsArray.forEach(elem => {
            set.add(elem)
        })
    }
    let ckeckBoxContainer = document.querySelector('.checkbox-container')
    set.forEach(elem => {
        ckeckBoxContainer.innerHTML += `<div class='each-tag'>
        <input class="check" name="check" id=${elem} type="checkbox">
        <label for=${elem}>${elem}</label>
        </div>`
    })
    return Array.from(set)
}
function getClassOption() {
    let set = new Set()
    for(let i =0; i <= apiData.length-1; i++) {
        set.add(apiData[i].class)
    }
    let select = document.querySelector('select')
    set.forEach(elem => {
        select.innerHTML += `<option class="option" id=${elem} value=${elem}>${elem}</option>`
    })
    
}
function tagsStringToArray(stringTag) {
    return stringTag.tags.split(",")
}




export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Study")
        console.log("ST CONST")
    }

    async renderHTML() {
        console.log("GOTHH")
        return `
        <section class="study-section">
        <h1 class="study-title">Study TECH Terms</h1>
        <form class="study-form" onsubmit="return false" name="form">
            <main class="study-main">
            <div aria-label="select tags" class="checkbox-container">
            </div>
            <div class="search-container">
                <div class="study-font-container">
                <i class="fas fa-chart-line"></i>
                </div>
                <div class="select-text">
                    <select  name="select" >
                    <option class="select-class" value="">select class</option>
                    </select>
                    <input class="text-input" type="text" name="text" aria-label="search" value="" placeholder="type for searching">
                </div>
                </div>
            </main>
        </form>
        <div class="num-items-container"></div>
        <div class="result-container"></div>
        </section>       
        `
    }
    async initialEvent() {
        await this.fetchQuizData()
        .then(() => {
            getClassOption()
            const app = document.querySelector("#app")
            app.style.display = "initial"
            console.log(apiData)
            tags = getSelectOption()
            keysArray = Object.keys(apiData[0])
            delete keysArray[0] //delete UUID
            container = document.querySelector(".result-container")
            num = document.querySelector('.num-items-container')
            text = document.querySelector(".text-input")
            text.addEventListener('change', firstSearch)
            options = document.querySelector("select")
            options.addEventListener('change', firstSearch)
            let allChecks = document.querySelectorAll(".check")
            for (let i = 0; i < allChecks.length; i++) {
                allChecks[i].addEventListener('change', firstSearch
                );
              }
        })
    }
    event() {
    }
    async fetchQuizData() {
        console.log("IN_FETCH")
        await fetch(endpoint)
          .then((result) => {
            return result.json()
          })
          .then((data) => apiData = data);
    }
    popState() {
    }
    beforeunload() {
        keysArray = []
    }
}