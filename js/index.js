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
    console.log(calculator)
    displayResults(calculator.getResult());
}

/**
 * Method that gets the results array from the calculator object
 * and displays it in the UI
 * 
 * @param {Array} results 
 */
function displayResults(results){
    console.log(results);
    const subdivisions = results.length;
    const resultsContainer = document.getElementById("results-container");
    const containerWidth = resultsContainer.clientWidth;
    const subdivisionWidth = containerWidth / subdivisions;

    for (let subdivisionIndex = 0; subdivisionIndex < subdivisions; subdivisionIndex++){
        const newPar = document.createElement("p");
        const divTextContent = document.createTextNode("Space between strings " + String(subdivisionIndex + 1) + " and " + String(subdivisionIndex + 2) + ": " + results[subdivisionIndex]);
        newPar.appendChild(divTextContent);
        resultsContainer.appendChild(newPar);
    }
}