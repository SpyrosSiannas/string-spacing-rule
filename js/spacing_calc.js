/** 
 * This is the algorithm for the calculation of the string spacing
 * Step 1: Generate the set of marks
 * Step 2: Iterate over all sets to find which one fits our specifications
 * Step 3: If there is remaining space, split it evenly between strings
 * 
 * @author Spyros S.
 * @author Alexis D.
 */

class SpacingCalculator {
    /**
     * Constructor of the calculator class.
     * @param {Number} nutLength The width of the instrument's nut
     * @param {Number} bassStringClearance The empty space between the instrument's bass string 
     *                                     and the edge of the fretboard
     * @param {Number} trebleStringClearance The empty space between the instrument's treble string 
     *                                       and the edge of the fretboard
     * @param {Number} stringNumber The instrument's number of strings
     * @param {Number} addingFactor The increment factor for the ruler's markers
     * @param {Object} units (optional) An object with the units the input values were measured in. Default is mm
     * @param {String} resultsUnit (optional) The measurment unit of the result. Default is mm
     */
    constructor(nutLength, 
                bassStringClearance,
                trebleStringClearance, 
                stringNumber, 
                addingFactor, 
                units = {
                            "nut-width" : "mm",
                            "bass-clearance" : "mm",
                            "treble-clearance" : "mm",
                            "adding-factor" : "mm"
                        },
                resultsUnit = "mm")
    {
        // Pass everything to member fields
        this.stringNumber = stringNumber;
        this.addingFactor = addingFactor;
        this.units = units;
        this.nutLength = nutLength;
        this.bassClearance = bassStringClearance;
        this.trebleClearance = trebleStringClearance;
        this.resultsUnit = resultsUnit;

        this.setUnits();

        // Basic setup
        this.stringSpacingSet = [0];
        this.result = [];
        this.remainingLength = this.nutLength - this.bassClearance - this.trebleClearance;
        this.remainingLength = this.round(this.remainingLength, 3);

        this.initializeMarkers();
    }

    /**
     * Method that initializes the "ruler markers"
     */
    initializeMarkers(){
        let adding = -1.0;
        let startingDistance = 2.0;
        let index = 0;
        
        while(adding < this.remainingLength){
            adding = startingDistance + index * this.addingFactor;
            // Round adding to 3 decimals
            adding = this.round(adding, 3);
            this.stringSpacingSet.push(adding);
            index += 1;
        }
    }

    /**
     * Method that implements the string spacing algorithm as follows
     * 
     * Step 1 - Iterate over all markers and see which set of size numStrings fits 
     *          our size specifications (nut width and margins)
     * 
     * Step 2 - If there is space remaining from our calculation, evenly split it between
     *          the strings
     * 
     * Step 3 - Validate that our output set is exactly the same size as our specifications
     * 
     */
    calculateOptimalSet(){
        let margin = (this.stringNumber - 1) * this.addingFactor;
        let minimum = this.remainingLength - margin;
        minimum = this.round(minimum, 3);
        let endingPoint = this.stringNumber - 1;
        let index;
        let optimalLength;

        for (let setIndex = 0; setIndex < this.stringSpacingSet.length - endingPoint; setIndex++){
            var thisLength = 0;
            for (let stringIndex = setIndex; stringIndex < setIndex + endingPoint; stringIndex++){
                thisLength += this.stringSpacingSet[stringIndex];
            }
            thisLength = this.round(thisLength, 3);

            if ((thisLength >= minimum) && (thisLength <= this.remainingLength)){
                index = setIndex;
                optimalLength = thisLength;
            }

            if ((thisLength > this.remainingLength)){
                break;
            }
        }

        if (optimalLength < this.remainingLength){
            let sub = this.remainingLength - optimalLength;
            let division = sub / endingPoint;
            for (let i = 0; i < endingPoint; i++){
                this.stringSpacingSet[index + i] += division;
            }
        }

        let check = 0.0;
        for (let i = 0; i < endingPoint; i++){
            check += this.stringSpacingSet[index + i];
        }   

        check = this.round(check, 3);
        if (check == this.remainingLength){
            for (let i = 0; i < endingPoint; i++){
                let thisRes = this.round(this.stringSpacingSet[index+i], 3);
                this.result.push(thisRes);
            }
        }
    }

    /**
     * Method that converts all the values of the calculator to mm 
     */
    setUnits(){
        if (this.units["nut-width"] == "in") this.nutLength = this.inchToMilimeter(this.nutLength);
        if (this.units["bass-clearance"] == "in") this.bassClearance = this.inchToMilimeter(this.bassClearance);
        if (this.units["treble-clearance"] == "in") this.trebleClearance = this.inchToMilimeter(this.trebleClearance);
        if (this.units["adding-factor"] == "in") this.addingFactor = this.inchToMilimeter(this.addingFactor);
    }

    /**
     * Wraper for the round method of the Math library for easier use
     */
    round(float, precision){
        let powerOfTen = Math.pow(10, precision);
        return Math.round(float * powerOfTen)/powerOfTen;
    }

    /**
     * Getter for the resulting array
     * @returns Result array
     */
    getResult(){
        if (this.resultsUnit == "in"){
            this.convertResult("in");
        }
        return this.result;
    }

    /**
     * A method that converts a number from milimeters to inches
     * @param {Number} inputInMilimeters 
     * @returns The result in inches
     */
    milimeterToInch(inputInMilimeters){
        return this.round(inputInMilimeters / 25.4, 3);
    } 

    /**
     * A method that converts a number from inches (fraction or singular input) to milimiters
     * @param {Number} nominator The inch nominator
     * @param {Number} denominator (optional) Inch denominator, default = 1
     * @returns the result in milimeters
     */
    inchToMilimeter(nominator, denominator = 1){
        let result = nominator / denominator;
        return this.round(result*25.4, 3);
    }

    /**
     * Method that converts the results to another measurment unit
     * @param {String} targetUnit The unit to convert the results to
     */
    convertResult(targetUnit){
        for (let resultIndex = 0; resultIndex < this.result.length; resultIndex++){
            if (targetUnit == "in") this.result[resultIndex] = this.milimeterToInch(this.result[resultIndex]);
            else this.result[resultIndex] = this.inchToMilimeter(this.result[resultIndex]);
        }
    }
}
