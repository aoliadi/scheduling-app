"use strict";

let endpoint = `http://localhost:8000/`;
 
const overallProcedure = {

    centresInfo: null,

    currentUserDetails: {
        userName: null,
        userSeatNumber: null,
        userId: null,
        dateOfRegistration: null,
        timeOfRegistration: null,
    },
     
    domElements: {
        loadingDiv: null,
        formWrapper: null,
        formElement: null,
        usernameInput: null,
        submitButton: null,

        alertContainer: null,
        alertSeatNumber: null,
        alertUsername: null,
        alertCloseIcon: null,
    },
    
    handlesEvents: {
        username: null,
        submit: null,
        form: null,
        closeAlert: null,
    },

    //starts operation
    initialize() {
        const domObjectKey = this.domElements;
        
        //query-select the elements from the DOM
        domObjectKey.usernameInput = document.querySelector('#username-js');
        domObjectKey.submitButton = document.querySelector('#btn--submit-js');
        domObjectKey.alertUsername = document.querySelector('#alert__username-js');
        domObjectKey.alertSeatNumber = document.querySelector('#alert__seat-number-js');
        domObjectKey.alertContainer = document.querySelector('#alert__container-js');
        domObjectKey.formElement = document.querySelector('#form__container-js');
        domObjectKey.formWrapper = document.querySelector('.form__wrapper');
        domObjectKey.loadingDiv = document.querySelector('#loading-js');
        domObjectKey.alertCloseIcon = document.querySelector('#icon--close-js');

        //calls for data to be fetched
        this.fetchData( endpoint + 'centres/' )
            .then( data => {
                this.centresInfo = data;
                this.domElements.loadingDiv.classList.add("hidden");
                this.domElements.formWrapper.classList.remove("hidden");
            }).catch( err => {
                window.location.assign("./404.html")
            });

            this.attachEvents( 
                this.domElements.usernameInput,
                this.domElements.submitButton,
                this.domElements.formElement,
                this.domElements.alertCloseIcon
            );
    },

    //fetch necessary data
    fetchData( uri ) {
        //pending further iterations, we use only the second hall - Science Room 1 - for now.
        let response = fetch( uri + 2 ).then(res => {
            if( res.status !== 200 ) {
                throw new Error('wrong endpoint')
            }
            return res.json();
        });

        return response;
    },
    
    //attach event listeners
    attachEvents( input, button, formElem, closeIcon ) {
        const handlerObjectKey = this.handlesEvents;
        
        //add event listeners
        handlerObjectKey.username = input.addEventListener( 'input', (e) => this.checkInputValue(e) );
        handlerObjectKey.submit = button.addEventListener( 'click', (e) => this.submission(e) );
        // handlerObjectKey.form = formElem.addEventListener( 'onsubmit', (e) => this.revealSeatNumber() );
        handlerObjectKey.closeAlert = closeIcon.addEventListener( 'click', (e) => this.redirectUserToAnotherPage() );

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

        // return theInputValue

        // this sets the username as the collected input value or null
        this.currentUserDetails.userName = theInputValue;
    },
    
    submission( e ) {
        e.preventDefault();
        let theCentre = this.centresInfo;
        
        if ( theCentre.numOfAvailableSeat === 0 || theCentre.seatsOccupied.length === theCentre.capacity ) {
            alert('Oooops! No seat available. Try again later');
        } else {
            let randomNumber = this.getRandomNumber( theCentre.numOfAvailableSeat );
            this.checkIfSeatIsAvailable( randomNumber );
        }
    },
    
    getRandomNumber( range ) {
        let randomNumber = Math.floor( Math.random() * range );

        return randomNumber;
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
        
        // if seat is available, before giving seat number, let's store userDetails
        this.storeUserDetails( {numberGenerated});
        //then giveSeatNumber to user
        this.giveSeatNumber();
    },
    
    giveSeatNumber() {

        let data = this.centresInfo;
        this.sendToDatabase({
            endpoint,
            type: "centres/2",
            data,
            method: "PUT"
        });
        
        data = this.currentUserDetails;
        this.sendToDatabase({
            endpoint,
            type: "userProfiles/",
            data,
            method: "POST"
        });
        
        // window.location.assign('./another.html');
    },
    
    storeUserDetails( {numberGenerated: seatNumber} ) {
        let dateFunc = new Date(),
            year = dateFunc.getFullYear(),
            candidateNumber = this.addZeroes( {theNumber: seatNumber, desiredLength: this.centresInfo.capacity.toString().length} );

        year = year.toString().slice(2);
        let currentTime = dateFunc.toLocaleTimeString(),
            currentDate = dateFunc.toDateString();

        this.currentUserDetails.userSeatNumber = seatNumber;
        this.currentUserDetails.userId = "" + year + this.centresInfo.hallId + candidateNumber;
        this.currentUserDetails.dateOfRegistration = currentDate;
        this.currentUserDetails.timeOfRegistration = currentTime;

    },

    // it addZeroes to numbers: 23 becomes 0023 based on the desiredLength value passed
    addZeroes( {desiredLength, range, theNumber} ) {
        let randomNumber = theNumber || Math.floor( Math.random() * range ),
            newNumber;
            
        // if range is a falsy value (i.e. range is not given)
        if (range && range.length > desiredLength ) {
            newNumber = randomNumber;
        } else if (randomNumber.length !== desiredLength ) {
            // this checks the number of zeroes to add
            let toAdd = desiredLength - randomNumber.toString().length,
                arr = Array(toAdd).fill(0); // creates an array filled with zeroes needed
            arr.push(randomNumber);
            newNumber = arr.join('');
            // debugger;
        } else {
            newNumber = randomNumber;
        }
    
        return newNumber;
    },

    sendToDatabase({ endpoint: uri, type, method, data }) {
        const otherOptions = {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        // fetch( uri + type, otherOptions );

        this.revealSeatNumber();
    },
    
    revealSeatNumber() {
        const domObjectKey = this.domElements;

        domObjectKey.alertSeatNumber.textContent = this.currentUserDetails.userSeatNumber;
        domObjectKey.alertUsername.innerHTML = this.currentUserDetails.userName;
        domObjectKey.alertContainer.classList.remove("hidden");
        domObjectKey.formWrapper.classList.add("hidden");
        // this.redirectUserToAnotherPage();
    },
    
    redirectUserToAnotherPage() {
        window.location.assign('./another.html');
    },
};

window.addEventListener( 
    'DOMContentLoaded', 
    () => overallProcedure.initialize()
);