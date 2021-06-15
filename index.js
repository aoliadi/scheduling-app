"use strict";

let endpoint = `http://localhost:8000/`;
 
const overallProcedure = {

    centres: null,

    centresInfo: null,

    eventsOnDatabase: [],

    currentUserDetails: {
        userName: null,
        userSeatNumber: null,
        userId: null,
        dateOfRegistration: null,
        timeOfRegistration: null,
    },
     
    domElements: {
        theForm: null,
        
        firstName: null,
        lastName: null,
        userName: null,
        mailAddress: null,
        telephoneNumber:  null,
        theEvent: null,
        theCentre: null,
        submitButton: null,


        // loadingDiv: null,
        // formWrapper: null,
        // usernameInput: null,

        // alertContainer: null,
        // alertSeatNumber: null,
        // alertUsername: null,
        // alertCloseIcon: null,
    },
    
    handlesEvents: {
        checkFirstName: null,
        checkLastName: null,
        checkUserName: null,
        checkMailAddress: null,
        checkEvent: null,
        checkCentre: null,
        submit: null
        // form: null,
        // closeAlert: null,
    },

    afterCheck: {
        firstName: false,
        lastName: false,
        mailAddress: false,
        userName: false,
        centre: false
    },

    changeAfterCheckValueOf(e, label) {
        let value = (!e.target.value || e.target.value == "null") ? false : true;
        this.afterCheck[`${label}`] = value;
        // this.storeCentreInfo(this.centres, e.target.value);
        this.readyForSubmission();
    },

    createOptions(arr, defaultChoice) {
        let allTheOptions = (arr.length > 1) ? `<option value="null" data-id="null">${defaultChoice}</option>` : null;
        arr.forEach((param, index) => {
            index += 1;
            allTheOptions += `<option value="${index}" data-id="${index}">${param}</option>`;
        });
        return allTheOptions;
    },

    //starts operation
    initialize() {
        // this selects DOM elements
        this.selectDomElements();
        
        //calls for data to be fetched
        this.fetchData( endpoint + 'events/' )
        .then( data => {
            // this.centresInfo = data;
            this.eventsOnDatabase = [...data];
            this.domElements.theEvent.innerHTML = this.createOptions(this.eventsOnDatabase, "Choose an event");
            // this.domElements.loadingDiv.classList.add("hidden");
            // this.domElements.formWrapper.classList.remove("hidden");
        }).catch( err => {
            // window.location.assign("./404.html")
        });

    },

    selectDomElements() {
        const domObjectKey = this.domElements;
        
        //query-select the elements from the DOM
        domObjectKey.theForm = document.querySelector("#form-js");
        domObjectKey.firstName = document.querySelector("#first_name-js");
        domObjectKey.lastName = document.querySelector("#last_name-js");
        domObjectKey.userName = document.querySelector("#username-js");
        domObjectKey.mailAddress = document.querySelector("#email-js");
        domObjectKey.telephoneNumber = document.querySelector("#tel-js");
        domObjectKey.theEvent = document.querySelector("select#purpose-js");
        domObjectKey.theCentre = document.querySelector("select#centre-js");
        domObjectKey.submitButton = document.querySelector("#btn--submit-js");
        this.attachEvents(domObjectKey);

        // domObjectKey.alertUsername = document.querySelector('#alert__username-js');
        // domObjectKey.alertSeatNumber = document.querySelector('#alert__seat-number-js');
        // domObjectKey.alertContainer = document.querySelector('#alert__container-js');
        // domObjectKey.formElement = document.querySelector('#form__container-js');
        // domObjectKey.formWrapper = document.querySelector('.form__wrapper');
        // domObjectKey.loadingDiv = document.querySelector('#loading-js');
        // domObjectKey.alertCloseIcon = document.querySelector('#icon--close-js');
    },

    //fetch necessary data
    fetchData( uri ) {
        //pending further iterations, we use only the second hall - Science Room 1 - for now.
        // let response = fetch( uri + 2 ).then(res => {
        //     if( res.status !== 200 ) {
        //         throw new Error('wrong endpoint')
        //     }
        //     return res.json();
        // });

        // return response;

        // fetch("data/data.json")
        // .then(res => res.json())
        // .then(data => {
        //     [events] = [data.events];
        //     let html = "";
        //     events.forEach((anEvent, index) => {
        //         html += `<option value="${index}" data-id="${index++}">${anEvent}</option>`;
        //         choice.innerHTML = html
        //     })
        // })
        let response = fetch( uri ).then(res => {
            if( res.status !== 200 ) {
                throw new Error('wrong endpoint')
            }
            return res.json();
        });

        return response;
    },
    
    //attach event listeners
    attachEvents({ userName, firstName, lastName, mailAddress, submitButton: submit, theEvent, theCentre }) {
        const handlerObjectKey = this.handlesEvents;

        //add event listeners
        handlerObjectKey.checkFirstName = firstName.addEventListener( "input", (e) => this.checkInputValue(e, "firstName"));
        handlerObjectKey.checkLastName = lastName.addEventListener( "input", (e) => this.checkInputValue(e, "lastName") );
        handlerObjectKey.checkMailAddress = mailAddress.addEventListener( "input", (e) => this.checkInputValue(e, "mailAddress") );
        handlerObjectKey.checkUserName = userName.addEventListener( "input", (e) => this.checkInputValue(e, "userName") );
        handlerObjectKey.checkEvent = theEvent.addEventListener( "change", (e) => this.availableCentres(e) );
        handlerObjectKey.checkCentre = theCentre.addEventListener( "change", (e) => this.changeAfterCheckValueOf(e, "centre") );
        handlerObjectKey.submit = submit.addEventListener( "click", (e) => this.submission(e) );
        // handlerObjectKey.form = formElem.addEventListener( "onsubmit", (e) => this.revealSeatNumber() );
        // handlerObjectKey.closeAlert = closeIcon.addEventListener( "click", (e) => this.redirectUserToAnotherPage() );
    },
    
    //check value of user's input
    checkInputValue( e, label ) {
        const theInputBar = e.target;
        let theInputValue = theInputBar.value.trim();
        
        if ( theInputValue.length < 2 ) {
            theInputBar.classList.remove('input--valid');
            theInputBar.classList.add('input--invalid');
            this.afterCheck[`${label}`] = false;
        } else {
            theInputBar.classList.remove('input--invalid');
            theInputBar.classList.add('input--valid');
            this.afterCheck[`${label}`] = true;
        };

        this.readyForSubmission();

        // this sets the username as the collected input value or null
        // this.currentUserDetails.userName = theInputValue;
        this.storeUserDetails({label, theInputValue});
    },

    availableCentres(e) {
        let id = e.target.value,
            halls =  null;

        if(id === "null") {
            this.domElements.theCentre.innerHTML = `<option value="null">Choose an hall</option>`;
            this.domElements.theCentre.disabled = true;
            this.afterCheck["centre"] = false;
            this.readyForSubmission();
        } else {
            this.fetchData( endpoint + "eventHalls/" + id)
            .then( data => {
                halls = [...data.halls];
                return this.fetchData( endpoint + "centres/")
            })
            .then(data => {
                // store all the centres
                this.centres = [...data];

                // the 1st filter function checks for centres hallId that matches any of the "halls" array-item and creates an array of the centres
                // the 2nd filter function removes any of the hall where there's no vacant seat for candidates 
                // the map function then extracts only the hallName of the centres available for the event
                let result = data.filter(item => halls.includes(item.id))
                                .filter(centre => centre.numOfAvailableSeat !== 0)
                                .map(item => item.hallName);
                if(result.length > 1) {
                    this.domElements.theCentre.disabled = false;
                    this.afterCheck["centre"] = false;
                    this.readyForSubmission();
                } else {
                    this.domElements.theCentre.disabled = true;
                    this.storeCentreInfo(data, result[0]);
                    this.afterCheck["centre"] = true;
                    this.readyForSubmission();
                }
                this.domElements.theCentre.innerHTML = this.createOptions(result, "Choose an hall");
            })
            .catch( err => {
                // window.location.assign("./404.html")
            });
        }
    },

    storeCentreInfo(centres, centre) {
        let result = centres.filter(item => centre.includes(item.hallName));
        // console.log(centres, centre, result);
        // console.log(result);
        this.centresInfo = result[0];
    },
    
    storeUserDetails({label, theInputValue}) {
        let dateFunc = new Date(),
            year = dateFunc.getFullYear();

        year = year.toString().slice(2);
        let currentTime = dateFunc.toLocaleTimeString(),
            currentDate = dateFunc.toDateString();

        this.currentUserDetails[`${label}`] = theInputValue;
        this.currentUserDetails.dateOfRegistration = currentDate;
        this.currentUserDetails.timeOfRegistration = currentTime;
        // console.log(this.currentUserDetails);
    },

    anyFalseValue( obj ) {
        let arr = [];
        for ( let [prop, val] of Object.entries(obj) ) {
            arr.push(val)
        };

        return !arr.includes(false);
    },

    readyForSubmission() {
        // this checks if there's any false prop value in the afterCheck object. If there isn't, it enables the submit button.
        this.enableSubmitButton(this.anyFalseValue(this.afterCheck));
    },

    enableSubmitButton( response ) {
        if(response) {
            this.domElements.submitButton.disabled = false;
        } else {
            this.domElements.submitButton.disabled = true;
        }
    },
    
    submission( e ) {
        e.preventDefault();
        console.log("ready for submission");
        // let theCentre = this.centresInfo;
        
        // if ( theCentre.numOfAvailableSeat === 0 || theCentre.seatsOccupied.length === theCentre.capacity ) {
        //     alert('Oooops! No seat available. Try again later');
        // } else {
        //     let randomNumber = this.getRandomNumber( theCentre.numOfAvailableSeat );
        //     this.checkIfSeatIsAvailable( randomNumber );
        // }
    },
    
    getRandomNumber( range ) {
        let randomNumber = Math.floor(Math.random() * range);

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
        
        let candidateNumber = this.addZeroes( {theNumber: numberGenerated, desiredLength: this.centresInfo.capacity.toString().length} ),
            year = new Date().getFullYear().toString().slice(2);

        this.currentUserDetails.userSeatNumber = candidateNumber;
        this.currentUserDetails.userId = "" + year + this.centresInfo.hallId + candidateNumber;

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

        this.redirectUserToAnotherPage();
        // window.location.assign('./another.html');
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
        fetch( uri + type, otherOptions );

        // this.revealSeatNumber();
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