"use strict";
 
// console.log( "it works!")
const overallProcedure = {

    username: 'admin',
    userSeatNumber: null,
    
    domElements: {
        usernameInput: null,
        submitButton: null,
    },
    
    handlesEvents: {
        username: null,
        submit: null
    },

    centresInfo: {
        hallName: 'Moremi Hall',
        capacity: 10,
        numOfAvailableSeat: 10,
        seatsOccupied: [ ]
    },
    
    //starts operation
    initialize() {
        const domObjectKey = this.domElements;
        
        //query-select the elements from the DOM
        domObjectKey.usernameInput = document.querySelector('#username-js');
        domObjectKey.submitButton = document.querySelector('#btn--submit-js');

        this.attachEvents( domObjectKey.usernameInput, domObjectKey.submitButton );
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

        if ( theInputValue.length < 2 ) {
            theInputBar.classList.add('input--invalid');
        } else {
            theInputBar.classList.remove('input--invalid');
            theInputBar.classList.add('input--valid');
            this.domElements.submitButton.disabled = false;
        }

        this.username = theInputValue;

    },

    submission( e ) {
        e.preventDefault();
        let theCentre = this.centresInfo;
        
        if ( theCentre.numOfAvailableSeat === 0 || theCentre.seatsOccupied.length === theCentre.capacity ) {
            console.log('No seat available.')
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
        this.giveSeatNumber()
    },
    
    giveSeatNumber() {
        // debugger;
        window.location.assign('./another.html');
        
        this.revealSeatNumber();
    },
    
    revealSeatNumber() {
        // window.alert(`Hello, ${this.username}. Your seat number is ${this.userSeatNumber}. Goodluck!`);
    },
}

window.addEventListener( 'DOMContentLoaded', () => overallProcedure.initialize() )