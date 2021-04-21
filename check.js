// let name = "Ahmed";

let dateFunc = new Date
let newObj = {
    dateFunc
}

let sentence = "",
    date = addZeroes( {theNumber: dateFunc.getDate(), desiredLength: 2} ),
    month = addZeroes( {theNumber: dateFunc.getMonth() + 1, desiredLength: 2} ),
    year = dateFunc.getFullYear();
    year = year.toString().slice(2);
    
    
    sentence += date + month + year;
    // sentence += month;
    
    // console.log(date, month, sentence, year)
    console.log(sentence)

function addZeroes( {desiredLength, range, theNumber} ) {
    let randomNumber = theNumber || Math.floor( Math.random() * range ),
        newNumber;
        
    if (range && range.length > desiredLength ) {
        newNumber = randomNumber;
    } else if (randomNumber.length !== desiredLength ) {
        let toAdd = desiredLength - randomNumber.toString().length;
        let arr = Array(toAdd).fill(0)
        arr.push(randomNumber);
        newNumber = arr.join('');
    } else {
        newNumber = randomNumber;
    }

    return newNumber;
}

// who(3, 99);