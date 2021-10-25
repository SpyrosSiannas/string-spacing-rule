/**
 * Method that passes the user's input to the calculator instance
 */
function calculateSpacing(){
    const nutWidth = document.getElementById("nut-width").value;
    const bassClearance = document.getElementById("bass-clearance").value;
    const trebleClearance = document.getElementById("treble-clearance").value;
    const stringNumber = document.getElementById("string-number").value;
    const addingFactor = document.getElementById("adding-factor").value;

    let calculator = new SpacingCalculator(nutWidth, bassClearance, trebleClearance, stringNumber, addingFactor);
    calculator.calculateOptimalSet();
    displayResults(calculator.getResult());
}

/**
 * Method that gets the results array from the calculator object
 * and displays it in the UI
 * 
 * @param {Array} results 
 */
function displayResults(results){
    const subdivisions = results.length;
    const resultsContainer = document.getElementById("results-container");

    // Empty the container
    resultsContainer.innerHTML = '';

    for (let subdivisionIndex = 0; subdivisionIndex < subdivisions; subdivisionIndex++){
        const newPar = document.createElement("p");
        const divTextContent = document.createTextNode("Space between strings " + String(subdivisionIndex + 1) + " and " + String(subdivisionIndex + 2) + ": " + results[subdivisionIndex]);
        newPar.appendChild(divTextContent);
        resultsContainer.appendChild(newPar);
    }
}

/**
 * Method that takes as input the id of the changed container and the 
 * unit system it converted into and applies the necessary UI toggling 
 * behaviour
 * 
 * @param {String} inputContainerID 
 * @param {String} unitSystem 
 */
function inputUnitChanged(inputContainerID, unitSystem){
    var inputContainer = document.getElementById(inputContainerID);
    const numChildren = inputContainer.childElementCount;
    if (unitSystem == "in"){
        for (let iChild=0; iChild < numChildren; iChild++){
            let thisChild = inputContainer.children[iChild];
            if (thisChild.nodeName == "INPUT"){
                thisChild.value = "";
                thisChild.placeholder = "";
                const newText = document.createTextNode(" / ");
                let newInput = document.createElement("input");
                newInput.type = "number";
                newInput.min = "0";
                inputContainer.insertBefore(newText, thisChild.nextSibling);
                inputContainer.insertBefore(newInput, thisChild.nextSibling.nextSibling);
                break;
            }
        }
    }
    else if (unitSystem == "mm"){
        for (let iChild=0; iChild < numChildren; iChild++){
            let thisChild = inputContainer.children[iChild];
            if (thisChild.nodeName == "INPUT"){
                let inchSeparator = thisChild.nextSibling;
                let inchDenominator = inchSeparator.nextSibling;
                inputContainer.removeChild(inchSeparator);
                inputContainer.removeChild(inchDenominator);
                break;
            }
        }
    }
}