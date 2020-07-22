class Calculator {
    constructor(
        currentFormula = "",
        currentBuffer = "",
        memory = "",
        currentTotal = "",
        previousBuffer = "",
        previousFormula = ""
    ) {
        this.previousFormula = previousFormula
        this.currentFormula = currentFormula
        this.previousBuffer = previousBuffer
        this.currentBuffer = currentBuffer
        this.memory = memory
        this.currentTotal = currentTotal

    }

    calculate(num1, num2, operation) {
        let ans
        num1 = parseFloat(num1)
        num2 = parseFloat(num2)
        // console.log(operation)
        switch (operation) {
            case "+":
                ans = num1 + num2
                break;
            case "-":
                ans = num1 - num2
                break;
            case "/":
                
                if (num2 == 0) {
                    return ("DIV0")
                }
                ans = num1 / num2
                break;
            case "*":
                ans = num1 * num2
                break;
            case "^":
                ans = Math.pow(num1, num2)
                break;
            case "%":
                ans = num1 / 100
                break;

        }
        return ans
    }

    calcCurrentFormula() {
        this.currentTotal = this.calculateStr(this.currentFormula)
        if (this.currentTotal >21) {this.currentTotal = ""+this.currentTotal.toPrecison(22)}
        this.previousFormula = ""+this.currentFormula
        this.currentFormula =  ""+this.currentTotal
        this.currentBuffer =   ""+this.currentTotal
    }

    calcCurrentBuffer() {
        // this.currentTotal += this.calculateStr(this.currentBuffer)
        this.previousBuffer += this.currentBuffer
        this.currentBuffer = ""
    }

    saveToMemory() {
        
        let regex = /^(\d*\.)?\d+$/gm
        if (regex.test(this.currentBuffer)) {
            
            this.memory = this.currentBuffer

        }
    }

    clearMemory() {
        this.memory = ""
    }

    recallMemory() {
        this.currentFormula += this.memory
    }
    calculateStr(formulaStr) {
        let regex = /(\d*\.?\d*)([+/\*/\-\%\^]?)/g
        let matches = [...formulaStr.matchAll(regex)]
        let subTot
        let curNumber
        let curOperation
        let prevOperation
        for (let el in matches) {
            let element = matches[el]
            curNumber = parseFloat(element[1])
            curOperation = element[2]
            
            if (curOperation && curOperation == "%") {
                curNumber = curNumber / 100
            }
            if (prevOperation && curNumber && subTot) {
                let num1 = subTot
                let num2 = curNumber
                subTot = this.calculate(num1, num2, prevOperation)
                if (subTot == "DIV0") {
                    break
                }

            } else if (!subTot) {
                subTot = parseFloat(curNumber)
            }
            if (curOperation && curOperation != "%") {
                prevOperation = curOperation
            }
            

        }
        
        return subTot

    }
}



function setUp() {
    let acceptableKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        "-", "+", "/", "*", "=", ".",
        "m", "r", "c", "M", "R", "C", "%", "^",
        "Backspace", "Enter"
    ]

    document.addEventListener("keydown", event => {
        if (acceptableKeys.indexOf(event.key) != -1) {
            
            let el = document.getElementById("btn-"+getSuffix(event.key))
            
            el.classList.add("button-down")
            el.classList.remove("button-up")
            calcKeyPress(event.key)
        }


    })

    document.addEventListener("keyup", event => {
     
        if (acceptableKeys.indexOf(event.key) != -1) {
            let el = document.getElementById("btn-"+getSuffix(event.key))
            el.classList.add("button-up")
            el.classList.remove("button-down")
        }


    })
    setUpBtns()
}

function setUpBtns() {
    btns = document.querySelectorAll(".btn")
    btns.forEach(element => {
        element.addEventListener("mousedown", (e) => {
            event.target.classList.add("button-down")
            event.target.classList.remove("button-up")
            calcKeyPress(e.target.dataset.key)
        })
        element.addEventListener("mouseup", (e) => {
            event.target.classList.add("button-up")
            event.target.classList.remove("button-down")
            calcKeyPress(e.target.dataset.key)
        })
    
    });
}


function getSuffix(key) {
    let suffix = key
    console.log(key)
    switch (key){
        case "+": 
            suffix = "plus"
            break
        case "*": 
            suffix = "mult"
            break    
        case "=":
        case "Enter": 
            suffix = "equal"
            break
        case ".": 
            suffix = "dot"
            break
        case "/": 
            suffix = "div"
            break    
        }
        return suffix
    } 


function calcKeyPress(key) {

    let calculation = document.getElementById("calculation")
    let status = document.getElementById("status-bar")
    let error = document.getElementById("error-bar")
    error.textContent = ""
   if (key.toLowerCase() == "c") {
        calculation.textContent = ""
        CALC.currentFormula = ""
        CALC.currentBuffer = ""
     } else if (key.toLowerCase() == "m") {
        CALC.saveToMemory()
        
        status.textContent = `M ${CALC.memory}`
    } else if (key.toLowerCase() == "r") {
        CALC.recallMemory()
        calculation.textContent = CALC.currentFormula
        CALC.currentBuffer = CALC.currentFormula
 
     } else if (key == "Backspace") {
        calculation.textContent = calculation.textContent.substr(0, calculation.textContent.length - 1)
        if (CALC.currentFormula) {
            CALC.currentFormula = CALC.currentFormula.substr(0, CALC.currentFormula.length - 1)
        }
        if (CALC.currentBuffer) {
            CALC.currentBuffer = CALC.currentBuffer.substr(0, CALC.currentBuffer.length - 1)
        }
    } else if(calculation.innerText.length>24){
        error.textContent = "Seriously, 25 characters? Try calculating in smaller chunks."
        } 
    else if (key == "=" || key == "Enter") {
        if (CALC.currentFormula.includes("/0")) {
                    error.textContent = "Really? Dividing by 0. Math isn't your strong suit is it?"    
        } else {
        CALC.calcCurrentFormula()
        calculation.textContent = CALC.currentTotal
        }
        } else {
        if ("-+^/*%".includes(key.toLowerCase())) {
            if (CALC.currentBuffer) {
                CALC.calcCurrentBuffer()
            }
        }
        if (CALC.currentBuffer && key == "." && CALC.currentBuffer.includes(".")) {
            error.textContent = "What kind of math uses 2 decimals?"

        } else {
            if ((("-+^/*%".includes(key.toLowerCase())) && 
                !(CALC.currentFormula.slice(-1).match(/[\+\-/\*\^]/))) || 
                !("-+^/*%".includes(key.toLowerCase()))){ 
            calculation.textContent += key
            CALC.currentFormula += key
            CALC.currentBuffer += key
            // console.log(CALC.currentFormula)
        }}

    }
}


setUp()
const CALC = new Calculator()