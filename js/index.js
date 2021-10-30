/**
 * Method that passes the user's input to the calculator instance
 */
function calculateSpacing(){
    let preparedValues = prepareValues();
    let calculator = new SpacingCalculator(preparedValues["nut-width"], 
                                           preparedValues["bass-clearance"],
                                           preparedValues["treble-clearance"],
                                           preparedValues["string-number"],
                                           preparedValues["adding-factor"], 
                                           preparedValues.units);
    calculator.calculateOptimalSet();
    displayResults(calculator.getResult());
}

function prepareValues(){
    // Values that require unit checking
    const inputContainers = ["nut-width-container", "bass-clearance-container", "treble-clearance-container", "adding-factor-container"];

    let preparedValues = {
        "nut-width" : 0,
        "bass-clearance" : 0,
        "treble-clearance" : 0,
        "string-number" : 0,
        "adding-factor" : 0,
        units : {}
    };

    for (containerId of inputContainers){
        // Get the input ID
        const inputID = containerId.split("-container", 1)[0];
        const unitID = inputID + "-unit";
        const containerUnit = document.getElementById(unitID).value;

        const primaryInput = document.getElementById(inputID);

        let result = 0;
        if (containerUnit == "in"){
            let nominator = primaryInput.value;
            // Skip the "/" character and get the denominator
            let denominator = primaryInput.nextSibling.nextSibling.value;
            result = nominator / denominator;
        } 
        else {
            result = primaryInput.value;
        }

        preparedValues[inputID] = Number(result);
        preparedValues.units[inputID] = containerUnit;
    }


    // stringNumber is a natural number
    const stringNumber = document.getElementById("string-number").value;
    preparedValues["string-number"] = Number(stringNumber);

    return preparedValues;
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