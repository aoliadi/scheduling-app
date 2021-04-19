"use strict";


let endpoint = `http://localhost:8000/centres/`;
 
// console.log( "it works!")
const overallProcedure = {

    // currentUserDetails: {
        username: null,
        userSeatNumber: null,
    // },
    
    domElements: {
        usernameInput: null,
        submitButton: null,
    },
    
    handlesEvents: {
        username: null,
        submit: null
    },

    centresInfo: {},

    //starts operation
    initialize() {
        const domObjectKey = this.domElements;
        
        //query-select the elements from the DOM
        domObjectKey.usernameInput = document.querySelector('#username-js');
        domObjectKey.submitButton = document.querySelector('#btn--submit-js');

        //calls for data to be fetched
        this.fetchData( endpoint );
    },

    //fetch necessary data
    async fetchData( uri ) {

        //pending further iterations, we use only the second hall - Science Room 1 - for now.
        let response = await fetch( uri + 2 ),
                data = await response.json();

        this.centresInfo = data;
        // console.log(this.centresInfo);

        this.attachEvents( this.domElements.usernameInput, this.domElements.submitButton );
    },
    
    //attach event listeners
    attachEvents( input, button ) {
        const handlerObjectKey = this.handlesEvents;
        
        //add event listeners
        handlerObjectKey.username = input.addEventListener( 'input', (e) => this.checkInputValue(e) );
        handlerObjectKey.submit = button.addEventListener( 'click', (e) => this.submission(e) );
    },
    
    //check value of user's input
    checkInputValue( e ) {
        const theInputBar = e.target;
        let theInputValue = theInputBar.value.trim();
        // console.log(theInputValue)

        if ( theInputValue.length < 2 ) {
            theInputBar.classList.remove('input--valid');
            theInputBar.classList.add('input--invalid');
            this.domElements.submitButton.disabled = true;
        } else {
            theInputBar.classList.remove('input--invalid');
            theInputBar.classList.add('input--valid');
            this.domElements.submitButton.disabled = false;
        }

        // sets username as the just collected input value
        this.username = theInputValue;
    },

    submission( e ) {
        e.preventDefault();
        let theCentre = this.centresInfo;
        
        if ( theCentre.numOfAvailableSeat === 0 || theCentre.seatsOccupied.length === theCentre.capacity ) {
            alert('Oooops! No seat available. Try again later');
        } else {
            this.getRandomNumber( this.centresInfo.numOfAvailableSeat );
        }
    },
    
    getRandomNumber( range ) {
        let randomNumber = Math.floor( Math.random() * range );
        
        this.checkIfSeatIsAvailable( randomNumber );
    },
    
    checkIfSeatIsAvailable( numberGenerated ) {
        let theCentre = this.centresInfo;
        
        if ( numberGenerated === 0 && !theCentre.seatsOccupied.includes(1) ) {
            // debugger;
            numberGenerated = 1;
            theCentre.seatsOccupied.push(numberGenerated);
            theCentre.numOfAvailableSeat -= 1;
        } else if ( numberGenerated !== 0 && !theCentre.seatsOccupied.includes(numberGenerated) ) {
            // debugger;
            theCentre.seatsOccupied.push(numberGenerated);
            theCentre.numOfAvailableSeat -= 1;
        } else {
            // debugger;
            this.getRandomNumber( this.centresInfo.numOfAvailableSeat );
        }
        
        this.userSeatNumber = numberGenerated;
        this.giveSeatNumber();
    },
    
    giveSeatNumber() {
        // debugger;
        
        this.sendToDatabase( endpoint, this.centresInfo );
        
        this.revealSeatNumber();
        // window.location.assign('./another.html');
    },
    
    // async sendToDatabase( uri, data ) {
    async sendToDatabase( uri, data ) {
        const otherOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        await fetch( uri + 2, otherOptions );
    },
    
    revealSeatNumber() {
        window.alert(`Hello, ${this.username}. Your seat number is ${this.userSeatNumber}. Goodluck!`);
        
        this.redirectUserToAnotherPage();
    },
    
    redirectUserToAnotherPage() {
        window.location.assign('./another.html');
    },
}


// window.addEventListener( 
//     'DOMContentLoaded', 
//     () => overallProcedure.fetchData(endpoint) 
// );
window.addEventListener( 
    'DOMContentLoaded', 
    () => overallProcedure.initialize()
);